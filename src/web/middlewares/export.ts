import DashboardAuthMiddleware from './dashboard/auth'
import ApiAuthMiddleware from './api/auth'
import type { Client } from '../../structures/DiscordClient'

export default function (client: Client) {
    return {
        dash: {
            auth: DashboardAuthMiddleware(client)
        },
        api: {
            auth: ApiAuthMiddleware(client)
        }
    }
}