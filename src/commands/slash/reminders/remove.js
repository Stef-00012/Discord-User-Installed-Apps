const { and, eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	await int.deferReply({
		ephemeral: true,
	});

	const reminderId = int.options.getString("id");

	const remindersSchema = client.dbSchema.reminders

	const reminder = await client.db.query.reminders.findFirst({
		where: and(
			eq(remindersSchema.userId, int.user.id),
			eq(remindersSchema.reminderId, reminderId)
		)
	})

	if (!reminder)
		return int.editReply({
			content: `There is no reminder with this id (\`${reminderId}\`)`,
		});

	await client.db
		.delete(remindersSchema)
		.where(
			and(
				eq(remindersSchema.userId, int.user.id),
				eq(remindersSchema.reminderId, reminderId)
			)
		)

	await int.editReply({
		content: `Successfully deleted the reminder with the id \`${reminderId}\``,
	});
};
