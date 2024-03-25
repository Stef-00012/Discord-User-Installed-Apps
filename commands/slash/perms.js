module.exports = {
    name: 'perms',
    
    async autocomplete(client, int) {
        const value = int.options.getFocused()
        const cmds = Array.from(client.commands)
        const messages = Array.from(client.messageCommands)
        const users = Array.from(client.userCommands)

        const commands = [
            ...cmds,
            ...messages,
            ...users
        ]

        const matches = commands
            .map(cmd => ({
                name: cmd[1].name,
                value: cmd[1].name
            }))
            .filter(cmd => cmd.name.toLowerCase().startsWith(value.toLowerCase()))

        if (matches.length > 25) matches = matches.slice(0, 24)

        await int.respond(matches)
    },
    async execute(client, int) {
        const subcommand = int.options.getSubcommand()
        
        require(`./perms/${subcommand}.js`)(client, int)
    }
}