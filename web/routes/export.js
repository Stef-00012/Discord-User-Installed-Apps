module.exports = (client) => {
    return {
        auth: {
            dashboardHome: require('./dashboard/home.js')(client),
            dashboardCommands: require('./dashboard/commands.js')(client),
            dashboardPermissions: require('./dashboard/permissions.js')(client)
        },
        api: {
            commands: require('./api/commands.js')(client),
            permissions: require('./api/permissions.js')(client)
        },
        noAuth: {
            tagPreview: require('./tagPreview/embedBuilder.js')(client),
            authLogin: require('./auth/login.js')(client),
            authLogout: require('./auth/logout.js')(client),
            unauthorized: require('./auth/unauthorized.js')(client)
        }
    }
}