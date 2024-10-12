const { eq } = require("drizzle-orm");

module.exports = {
	name: "reminders",
	requires: [],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		const remindersSchema = client.dbSchema.reminders;

		const userReminders =
			(await client.db.query.reminders.findMany({
				where: eq(remindersSchema.userId, int.user.id),
			})) || [];

		if (userReminders?.length <= 0) return await int.respond([]);

		let matches = userReminders
			.filter((reminder) => reminder.reminderId.startsWith(value))
			.map((reminder) => ({
				name: `${reminder.reminderId} - ${
					reminder.description.length > 80
						? `${reminder.description.substr(0, 80)}...`
						: reminder.description.substr(0, 80)
				}`,
				value: reminder.reminderId,
			}));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		await require(`./reminders/${subcommand}.js`)(client, int);
	},
};
