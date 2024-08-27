const axios = require("axios");

module.exports = {
	name: "reminders",
	requires: ["mongo"],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		const userReminders = await client.mongo.reminders.find({
			userId: int.user.id,
		});

		if (!userReminders) return await int.respond([]);

		let matches = userReminders
			.filter((reminder) => reminder.reminderId.startsWith(value))
			.map((reminder) => ({
				name: `${reminder.reminderId} - ${reminder.description.length > 80 ? `${reminder.description.substr(0, 80)}...` : reminder.description.substr(0, 80)}`,
				value: reminder.reminderId,
			}));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./reminders/${subcommand}.js`)(client, int);
	},
};
