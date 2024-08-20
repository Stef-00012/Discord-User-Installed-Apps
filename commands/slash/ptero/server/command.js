const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = async (client, int) => {
    const id = int.options.getString('id')
    const command = int.options.getString('command')

    await int.deferReply()

    const userPteroData = await client.mongo.ptero.findOne({
        id: int.user.id
    })

    if (!userPteroData || !userPteroData.panelUrl || !userPteroData.apiKey) return int.editReply({
        content: "Your Pterodactyl config are incorrect"
    });

    const panelUrl = userPteroData.panelUrl
    const apiKey = userPteroData.apiKey

    try {
        await axios.post(`${panelUrl}/api/client/servers/${id}/command`, {
            command
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        })

        await int.editReply({
            content: `Successfully ran the command \`${command}\` on the server with ID \`${id}\``
        })
    } catch(e) {
        if (e?.response?.status === 401) return int.editReply({
            content: "Your API key is not valid"
        })

        if (e?.response?.status === 502) return int.editReply({
            content: "The server is offline"
        })

        console.log(e)
        int.editReply({
            content: "Something went wrong..."
        })
    }
}