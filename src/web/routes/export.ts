import DashboardHomeRoute from './dashboard/home'
import DashboardCommandsRoute from './dashboard/commands'
import DashboardPermissionsRoute from './dashboard/permissions'

import ApiCommandsRoute from './api/commands'
import ApiPermissionsRoute from './api/permissions'

import AuthLoginRoute from './auth/login'
import AuthLogoutRoute from './auth/logout'
import UnautorizedRoute from './auth/unauthorized'

import TagPreviewRoute from './tagPreview/embedBuilder'

import type { Client } from '../../structures/DiscordClient'

export default function (client: Client) {
    return {
        auth: {
            dashboardHome: DashboardHomeRoute(client),
            dashboardCommands: DashboardCommandsRoute(client),
            dashboardPermissions: DashboardPermissionsRoute(client)
        },
        api: {
            commands: ApiCommandsRoute(client),
            permissions: ApiPermissionsRoute(client)
        },
        noAuth: {
            authLogin: AuthLoginRoute(client),
            authLogout: AuthLogoutRoute(client),
            unauthorized: UnautorizedRoute(client),
            tagPreview: TagPreviewRoute(client)
        }
    }
}