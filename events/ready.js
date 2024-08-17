const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("node:fs");

module.exports = async (client) => {
	console.log(`The app is online (logged as ${client.user.tag})`);

	setInterval(async () => {
		const reminders = await client.mongo.reminders.find({})

		for (const reminder of reminders) {
			const reminderDate = new Date(reminder.date)

			if (Date.now() > reminderDate.getTime()) {
				try {
					const user = await client.users.fetch(reminder.userId)

					if (!user) return;

					const embed = new EmbedBuilder()
						.setTitle('Reminder')
						.setDescription(reminder.description)

					await user.send({
						embeds: [embed]
					})

					await client.mongo.reminders.deleteOne({
						reminderId: reminder.reminderId
					})
				} catch(e) {
					console.log(e)

					await client.mongo.reminders.deleteOne({
						reminderId: reminder.reminderId
					})
				}
			}
		}
	}, 30000)

	const commands = await client.application.commands.fetch();

	const cmds = require("../commands.js");

	try {
		await axios.put(
			`https://discord.com/api/v10/applications/${client.user.id}/commands`,
			cmds,
			{
				headers: {
					Authorization: `Bot ${client.config.token}`,
					"Content-Type": "application/json; charset=UTF-8",
					"User-Agent": "DiscordBot (discord.js, 14.14.1 (modified))",
				},
			},
		);
	} catch (err) {
		console.error(JSON.stringify(err.response.data, null, 2));
	}

	if (commands.size === 0) {
		fs.writeFileSync(`${__dirname}/../data/commandPermissions.json`, "{}");
	}
};
