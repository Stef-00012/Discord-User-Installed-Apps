const { and, eq } = require("drizzle-orm");
const ms = require("enhanced-ms");
const { randomUUID } = require("node:crypto");

module.exports = async (client, int) => {
	const time = int.options.getString("time");
	const reason = int.options.getString("reason");

	const msTime = ms(time);

	if (!msTime || msTime < 30000)
		return int.reply({
			content: "Invalid time",
			ephemeral: true,
		});

	let reminderId = randomUUID().slice(0, 8);

	await int.deferReply({
		ephemeral: true,
	});

	let existsReminderWithId = await checkId(client, int, reminderId);

	while (existsReminderWithId) {
		reminderId = randomUUID().slice(0, 8);

		existsReminderWithId = await checkId(client, int, reminderId);
	}

	const remindersSchema = client.dbSchema.reminders

	await client.db
		.insert(remindersSchema)
		.values({
			userId: int.user.id,
			reminderId,
			description: reason,
			date: new Date(Date.now() + msTime).toISOString(),
		})

	return int.editReply({
		content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reason}`,
	});
};

async function checkId(client, int, reminderId) {
	const remindersSchema = client.dbSchema.reminders

	const existingReminderWithid = await client.db.query.reminders.findFirst({
		where: and(
			eq(remindersSchema.reminderId, reminderId),
			eq(remindersSchema.userId, int.user.id)
		)
	})

	if (existingReminderWithid) return true;

	return false;
}
