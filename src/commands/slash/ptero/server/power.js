const axios = require('axios')
const { eq } = require('drizzle-orm')

module.exports = async (client, int) => {
    const id = int.options.getString('id')
    const action = int.options.getString('action')

    await int.deferReply()

    const pteroSchema = client.dbSchema.ptero

    const userPteroData = await client.db.query.ptero.findFirst({
        where: eq(pteroSchema.id, int.user.id)
    })

    if (!userPteroData) return int.editReply({
        content: "Your Pterodactyl config are incorrect"
    });

    const panelUrl = userPteroData.panelUrl
    const apiKey = userPteroData.apiKey

    try {
        await axios.post(`${panelUrl}/api/client/servers/${id}/power`, {
            signal: action
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        })

        await int.editReply({
            content: `Successfully ran the \`${action}\` power action on the server with ID \`${id}\``
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