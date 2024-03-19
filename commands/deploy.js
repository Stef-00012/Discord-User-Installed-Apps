const axios = require('axios')

module.exports = {
    name: 'deploy',
    
    async execute(client, int) {
        await int.deferReply({
            ephemeral: true
        })
        
        const commands = require('../commands.js')
    
        try {
            await axios.put(`https://discord.com/api/v10/applications/${client.user.id}/commands`, commands, {
                headers: {
                    Authorization: `Bot ${client.config.token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'User-Agent': 'DiscordBot (discord.js, 14.14.1 (modified))'
                }
            })
            
            await int.editReply({
                content: 'Successfully deployed the commands'
            })
        } catch(err) {
            return int.edirReply({
                content: 'Something went wrong, try again'
            })
        }
    }
}