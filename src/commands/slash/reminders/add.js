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

	const newReminder = await new client.mongo.reminders({
		userId: int.user.id,
		reminderId,
		description: reason,
		date: new Date(Date.now() + msTime).toISOString(),
	});

    await newReminder.save()

	return int.editReply({
		content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reason}`,
	});
};

async function checkId(client, int, reminderId) {
	const existingReminderWithid = await client.mongo.reminders.findOne({
		userId: int.user.id,
		reminderId,
	});

	if (existingReminderWithid) return true;

	return false;
}
