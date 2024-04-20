module.exports = async (client, int) => {
	let userData = await client.mongo.tags.findOne({
		id: int.user.id,
	});

	if (!userData)
		userData = new client.mongo.tags({
			id: int.user.id,
			tags: [],
		});

	const tagName = int.options.getString("name");
	const ephemeral = int.options.getBoolean("ephemeral") || false;

	const tags = [...userData.tags];

	const existingTag = tags.find((tag) => tag.name === tagName);

	if (!existingTag)
		return int.reply({
			content: "This tag doesn't exist",
			ephemeral: true,
		});

	int.reply({
		content: existingTag.value,
		ephemeral,
	});
};
