module.exports = async (client, int) => {
    if (!int.isChatInputCommand()) return;
    
    if (!client.config.owners.includes(int.user.id)) return int.reply({
        ephemeral: true,
        content: "You're not allowed to run this command"
    })
    
    const cmd = client.commands.get(int.commandName)

    if (!cmd) return int.reply({
        ephemeral: true,
        content: "I couldn't find this command"
    });

    cmd.execute(client, int)
}