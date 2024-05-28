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
	const tagContent = int.options.getString("content") || null;
	const hasEmbeds = int.options.getBoolean("embeds") || false;

	const tags = [...userData.tags];

	const existingTag = tags.find((tag) => tag.name === tagName);
	
	const tagData = {
	    content: tagContent || null,
	    embeds: null
	}

	if (existingTag) {
		const tagIndex = tags.findIndex((tag) => tag.name === tagName);

		tags[tagIndex].data = tagData;

		int.reply({
			content: `Successfully replaced the tag \`${tagName}\` with the content:\n>>> ${
				tagContent.length >= 2000 - 58 - tagName.length
					? `${tagContent.substr(0, 2000 - 58 - tagName.length)}...`
					: tagContent
			}`,
			ephemeral: true,
		});
	} else {
		tags.push({
			name: tagName,
			data: tagData,
		});

		int.reply({
			content: `Successfully set the tag \`${tagName}\` with the content:\n>>> ${
				tagContent.length > 2000 - 58 - tagName.length
					? `${tagContent.substr(0, 2000 - 58 - tagName.length)}...`
					: tagContent
			}`,
			ephemeral: true,
		});
	}

	userData.tags = tags;

	await userData.save();
};
