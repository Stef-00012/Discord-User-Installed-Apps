const mongoose = require('mongoose')

const tags = mongoose.model('tags', new mongoose.Schema({
    id: {
        type: String
    },
    tags: [
        {
            name: {
                type: String
            },
            value: {
                type: String
            }
        }
    ]
}))

function isConnected() {
    return mongoose.STATES[mongoose.connection.readyState] == 'connected'
}

module.exports = {
    tags,
    isConnected
}