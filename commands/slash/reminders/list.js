const ms = require('enhanced-ms')
const { EmbedBuilder } = require("discord.js")

module.exports = async (client, int) => {
    await int.deferReply({
        ephemeral: true
    })

    const userRemiders = await client.mongo.reminders.find({
        userId: int.user.id
    })

    if (!userRemiders || !userRemiders.length) return int.editReply({
        content: "You have no reminders"
    })

    const remindersString = userRemiders
        .map(reminder => {
            const timeDiff = new Date(reminder.date).getTime() - new Date().getTime()

            return `[\`${reminder.reminderId}\`] | in ${ms(timeDiff) || "0s"} - ${reminder.description}`
        })
        .join('\n- ')

    const embed = new EmbedBuilder()
        .setTitle("Your reminders")
        .setDescription(remindersString.length > 3995 ? `- ${remindersString.substr(0, 3995)}...` : `- ${remindersString}`)

    await int.editReply({
        embeds: [embed]
    })
}