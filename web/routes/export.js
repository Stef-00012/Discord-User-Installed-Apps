module.exports = (client) => {
    return {
        dash: {
            tagPreview: require('./tagPreview/index.js')(client)
        },
        api: {}
    }
}