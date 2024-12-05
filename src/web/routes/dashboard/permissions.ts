import fs from 'node:fs'
import path from 'node:path'
import express, { type NextFunction, type Request, type Response } from 'express'
import type { Client } from '../../../structures/DiscordClient'
import type { CommandPermissions } from '../../../types/permissions'

export default function(client: Client) {
    const router = express.Router()

    router.get('/dashboard/permissions', (req: Request, res: Response, next: NextFunction): any => {
        const username = client.user?.tag || "Unknown#0000";
        const commands = client.commands.map(cmd => cmd.name)
        const permissionsPath = path.join(__dirname, '../../../data/permissions/commandPermissions.json')

        const permissionsString = fs.readFileSync(permissionsPath, 'utf-8')

        try {
            const permissions: CommandPermissions = JSON.parse(permissionsString)

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