module.exports = async (client, int) => {
	await int.deferReply({
		ephemeral: true,
	});

	const reminderId = int.options.getString("id");

	const reminder = await client.mongo.reminders.findOne({
		userId: int.user.id,
		reminderId,
	});

    console.log(reminder)

	if (!reminder)
		return int.editReply({
			content: `There is no reminder with this id (\`${reminderId}\`)`,
		});

	await client.mongo.reminders.deleteOne({
		userId: int.user.id,
		reminderId,
	});

	await int.editReply({
		content: `Successfully deleted the reminder with the id \`${reminderId}\``,
	});
};
