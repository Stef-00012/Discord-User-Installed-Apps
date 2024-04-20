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

	const tags = [...userData.tags];

	if (tags.length === 0)
		return int.reply({
			content: "You have no tags",
			ephemeral: true,
		});

	const tagsString = tags.map((tag) => tag.name).join("\n- ");

	int.reply({
		content: `Your tags are:\n- ${
			tagsString.length > 1980 ? `${tagsString.substr(0, 1980)}...` : tagsString
		}`,
		ephemeral: true,
	});
};
