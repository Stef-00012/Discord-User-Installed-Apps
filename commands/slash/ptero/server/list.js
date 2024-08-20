const { EmbedBuilder } = require("discord.js");
const axios = require('axios')

module.exports = async (client, int) => {
    const userPteroData = await client.mongo.ptero.findOne({
        id: int.user.id
    })

    await int.deferReply()

    if (!userPteroData || !userPteroData.panelUrl || !userPteroData.apiKey) return int.editReply({
        content: "Your Pterodactyl config are incorrect"
    });

    const panelUrl = userPteroData.panelUrl
    const apiKey = userPteroData.apiKey

    try {
        const res = await axios.get(`${panelUrl}/api/client`, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        })

        const data = res.data.data

        const servers = data.map(server => `- ${server.attributes.name} [\`${server.attributes.identifier}\`]`).join('\n')

        const embed = new EmbedBuilder()
            .setTitle('Your servers')
            .setDescription(servers.length > 4096 ? `${servers.substr(0, 4093)}...` : servers)

        await int.editReply({
            embeds: [embed]
        })
    } catch(e) {
        if (e?.response?.status === 401) return int.editReply({
            content: "Your API key is not valid"
        })
        
        console.log(e)
        int.editReply({
            content: "Something went wrong..."
        })
    }
}