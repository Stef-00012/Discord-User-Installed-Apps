const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, int) => {
    await int.deferReply({
        ephemeral: true
    })
    const file = int.options.getAttachment('file')
    const overwrite = int.options.getBoolean('overwrite') || false

    if (file.contentType.split(';')[0] !== "application/json") return int.reply({
        ephemeral: true,
        content: "The uploaded file is not a JSON file"
    });

    try {
        const request = await axios.get(file.url)
        const tags = request.data

        if (typeof tags === "string") JSON.parse(tags)

        const valid = tags.every(tag => {
            if (!tag.name) return false;
            if (!tag.data) return false;
            if (!tag.data.content && !tag.data.embeds) return false;
            if (tag.data.embeds?.length <= 0) return false;

            return true;
        })

        if (!valid) return int.editReply({
            content: "The JSON you imported is not a valid tags JSON"
        });


        const userData = await client.mongo.tags.findOne({
            id: int.user.id
        })

        if (overwrite) {
            userData.tags = tags
        } else {
            // const conflicts = []

            for (const tag of tags) {
                const existingTag = userData.tags.find(userTag => userTag.name === tag.name)

                if (existingTag) {
                    userData.tags = userData.tags.filter(userTag => userTag.name !== tag.name)
                    // conflicts.push([
                    //     existingTag,
                    //     tag
                    // ])

                    // continue;
                }
    
                userData.tags.push(tag)
            }

            // for (const conflict of conflicts) {
                
            // }
        }

        await userData.save()

        await int.editReply({
            content: `Successfully imported ${tags.length} tags`
        })
    } catch(e) {
        return int.editReply({
            content: "The JSON you imported is not a valid tags JSON"
        })
    }
}