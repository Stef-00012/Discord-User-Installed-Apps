import path from 'node:path'
import express, { type NextFunction, type Request, type Response } from 'express'
import type { Client } from '../../../structures/DiscordClient'
import type { CommandStatus } from '../../../types/permissions'

export default function (client: Client) {
    const router = express.Router()

    router.get('/dashboard/commands', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const username = client.user?.tag || "Unknown#0000";
        const commands = client.commands.map(cmd => cmd.name)

        const commandStatusPath = path.join(__dirname, '../../../data/permissions/commandStatus.json')

        try {
            const commandStatus: CommandStatus = await Bun.file(commandStatusPath).json()

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
        } catch (e) {
            return res.sendStatus(500)
        }
    })


    return router;
}