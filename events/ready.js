const axios = require('axios')

module.exports = async (client, int) => {
    console.log("The app is online")
    
    const commands = await client.application.commands.fetch()
    
    if (commands.length == 0) {
        try {
            await axios.put(`https://discord.com/api/v10/applications/${client.user.id}/commands`, commands, {
                headers: {
                    Authorization: `Bot ${client.config.token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'User-Agent': 'DiscordBot (discord.js, 14.14.1 (modified))'
                }
            })
        } catch(err) {
            console.error(JSON.stringify(err.response.data, null, 2))
        }
    }
}