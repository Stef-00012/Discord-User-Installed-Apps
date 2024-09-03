const express = require('express')

module.exports = (client) => {
    const router = express.Router()

    router.get('/dashboard', async (req, res, next) => {
        if (!client.application.approximateUserInstallCount) await client.application.fetch();
        
        const limit = 5
        const commands = client.commands.map(cmd => cmd.name)
        const users = client.application.approximateUserInstallCount
        const avatar = client.user.avatarURL({
            size: 4096
        })
        const username = client.user.tag
        let mostUsedCommands = await client.mongo.analytics.find({}) || []

        for (let i = 0; mostUsedCommands.length < limit; i++) {
            if (!mostUsedCommands.find(cmd => cmd.name === commands[i])) mostUsedCommands.push({
                name: commands[i],
                uses: 0
            })
        }

        mostUsedCommands = mostUsedCommands
            .sort((a, b) => b.uses - a.uses)
            .slice(0, 5)

        res.render('dashboard/home', {
            users,
            username,
            avatar,
            mostUsedCommands,
            // databaseOn: client.mongo.isConnected()
        })
    })


    return router;
}