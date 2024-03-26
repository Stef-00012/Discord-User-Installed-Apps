const fs = require('fs')

module.exports = async (client, int) => {
    const commandStatus = fs.readFileSync(`${__dirname}/../../../data/commandStatus.json`)
    const commandStatusJSON = JSON.parse(commandPermissions)
    
    const commandName = int.options.getString('command')
    
    if (commandStatusJSON[commandName]) return int.reply({
        content: `\`${commandName}\` is already enabled`,
        ephemeral: true
    })
    
    const commandData = client.commands.get(commandName)
    
    if (commandData.requires.includes('mongo') && !client.config.mongo) return int.reply({
        content: 'You must add a MongoDB url in order to be able to enable this command',
        ephemeral: true
    })
    
    commandStatusJSON[commandName] = true
    
    fs.writeFileSync(`${__dirname}/../../../data/commandStatus.json`, JSON.stringify(commandStatusJSON, null, 2))
    
    int.reply({
        content: `Successfully enabled the command \`${commandName}\``,
        ephemeral: true
    })
}