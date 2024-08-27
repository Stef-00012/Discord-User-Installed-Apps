const { AttachmentBuilder } = require("discord.js")

module.exports = async (client, int) => {
    await int.deferReply({
        ephemeral: true
    })

    const userData = await client.mongo.tags.findOne({
        id: int.user.id
    })

    if (!userData || !userData.tags || !userData.tags.length) return int.editReply({
        content: "You have no tags",
        ephemeral: true
    })

    const formattedTags = userData.tags.map(tag => ({
        name: tag.name,
        data: tag.data
    }))

    const stringifiedTags = JSON.stringify(formattedTags, null, 4)

    const attachment = new AttachmentBuilder(Buffer.from(stringifiedTags), {
        name: "tags.json"
    })

    await int.editReply({
        files: [attachment]
    })
}