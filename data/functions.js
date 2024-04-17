const fs = require('fs')

const functions = {}

const funcs = fs.readdirSync(`${__dirname}/functions`).filter(file => file.endsWith('.js'))

for (const func of funcs) {
    const funcData = require(`${__dirname}/functions/${func}`)
    
    functions[func.split('.')[0]] = funcData
}

module.exports = functions