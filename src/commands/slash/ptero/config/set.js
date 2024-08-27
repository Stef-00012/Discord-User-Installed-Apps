module.exports = async (client, int) => {
    let panelUrl = int.options.getString('url')
    const apiKey = int.options.getString('key')

    if (!panelUrl.startsWith('http://') && !panelUrl.startsWith('https://')) return int.reply({
        content: "The provided panel URL is invalid",
        ephemeral: true
    })

    panelUrl = panelUrl.split('/').slice(0, 3).join('/')


    if (!apiKey.startsWith('ptlc_')) return int.reply({
        content: "Invalid API key",
        ephemeral: true
    })

    await int.deferReply({
        ephemeral: true
    })

    let userPteroData = await client.mongo.ptero.findOne({
        id: int.user.id
    })

    if (!userPteroData) userPteroData = new client.mongo.ptero({
        id: int.user.id
    })

    userPteroData.panelUrl = panelUrl
    userPteroData.apiKey = apiKey

    await userPteroData.save()

    int.editReply({
        content: "Successfully saved your pterodactyl config"
    })
}