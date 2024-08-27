module.exports = (client) => {
    return {
        dash: {
            auth: require('./dashboard/auth.js')(client)
        },
        api: {
            auth: require('./api/auth.js')(client)
        }
    }
}