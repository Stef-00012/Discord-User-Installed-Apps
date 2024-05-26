const { exec } = require('child_process')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'console',
    requires: [],
    
    async execute(client, int) {
        const cmd = int.options.getString('command')
        const ephemeral = int.options.getBoolean('personal')

        await int.deferReply({
            ephemeral
        })
        
        const embed = new EmbedBuilder()
        
        const fields = [
            {
                name: 'Command:',
                value: `\`\`\`ansi\n${cmd}\n\`\`\``
            }
        ]
        
        exec(cmd, async (error, stdout, stderr) => {
            if (error && error.message) {
                if (error.message.length > 1000) {
                    console.log(`\n\nError Message:\n${error.message}`)

                    error.message = error.message.substr(0, 1000)
                }

                fields.push({ name: 'Error:', value: `\`\`\`ansi\n${error.message}\n\`\`\``})
            }
            if (stderr) {
                if (stderr.length > 1000) {
                    console.log(`\n\nStdErr:\n${stderr}`)

                    stderr = stderr.substr(0, 1000)
                }

                fields.push({ name: 'StdErr:', value: `\`\`\`ansi\n${stderr}\n\`\`\`` })
            }
            if (stdout) {
                if (stdout.length > 1000) {
                    console.log(`\n\nStdOut:\n${stdout}`)

                    stdout = stdout.substr(0, 1000)
                }

                fields.push({ name: 'StdOut:', value: `\`\`\`ansi\n${stdout}\n\`\`\`` })
            }

            embed
                .setFields(fields)
        
            await int.editReply({
                embeds: [embed]
            })
        })
    }
}