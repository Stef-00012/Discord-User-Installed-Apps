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
	const removeContent = int.options.getBoolean("remove") || false;

	const tags = [...userData.tags];

	const existingTag = tags.find((tag) => tag.name === tagName);

	const tagData = {
		content: removeContent ? null : tagContent || null,
		embeds: existingTag?.data?.embeds || null,
	};

	if (
		(!tagData.content || tagData.content?.length <= 0) &&
		(!tagData.embeds || tagData.embeds?.length <= 0)
	)
		return int.reply({
			content: "A tag can not be empty",
			ephemeral: true,
		});

	if (removeContent && !existingTag)
		return int.reply({
			content: "This tag doesn't exist",
			ephemeral: true,
		});

	if (removeContent) {
		const tagIndex = tags.findIndex((tag) => tag.name === tagName);

		tags[tagIndex].data = tagData;

		int.reply({
			content: `Successfully removed the content of thr tag "${tagName}"`,
			ephemeral: true,
		});

		userData.tags = tags;

		await userData.save();

		return;
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
