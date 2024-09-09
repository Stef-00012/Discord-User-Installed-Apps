const fs = require('node:fs')
const path = require('node:path')
const express = require('express')

module.exports = (client) => {
    const router = express.Router()

    router.get('/dashboard/commands', (req, res, next) => {
        const username = client.user?.tag || "Unknown#0000";
        const commands = client.commands.map(cmd => cmd.name)

        const commandStatusPath = path.join(__dirname, '../../../data/commandStatus.json')

        const commandStatusString = fs.readFileSync(commandStatusPath, 'utf-8')

        try {
            const commandStatus = JSON.parse(commandStatusString)

            for (const command of commands) {
                if (!commandStatus[command]) commandStatus[command] = false
            }

            for (const command in commandStatus) {
                if (!commands.includes(command)) delete commandStatus[command];
            }

            res.render('dashboard/commands', {
                commandStatus,
                username
            })
        } catch(e) {
            return res.sendStatus(500)
        }
    })


    return router;
}