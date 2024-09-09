const fs = require('node:fs')
const path = require('node:path')
const express = require('express')

module.exports = (client) => {
    const router = express.Router()

    router.get('/dashboard/permissions', (req, res, next) => {
        const username = client.user?.tag || "Unknown#0000";
        const commands = client.commands.map(cmd => cmd.name)
        const permissionsPath = path.join(__dirname, '../../../data/commandPermissions.json')

        const permissionsString = fs.readFileSync(permissionsPath, 'utf-8')

        try {
            const permissions = JSON.parse(permissionsString)

            for (const command of commands) {
                if (!permissions[command]) permissions[command] = []
            }

            for (const command in permissions) {
                if (!commands.includes(command)) delete permissions[command];
            }

            res.render('dashboard/permissions', {
                permissions,
                username
            })
        } catch(e) {
            return res.sendStatus(500)
        }
    })


    return router;
}