const axios = require("axios");

module.exports = {
	name: "reminders",
	requires: ["mongo"],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		const userReminders = await client.mongo.reminders.find({
			id: int.user.id,
		});

		if (!userReminders) return await int.respond([]);

		let matches = userReminders
			.map((reminder) => ({
				name: reminder.reminderId,
				value: reminder.reminderId,
			}))
			.filter((reminder) => reminder.reminderId.startsWith(value));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./reminders/${subcommand}.js`)(client, int);
	},
};
