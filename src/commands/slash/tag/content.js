const { and, eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	const tagName = int.options.getString("name");
	const tagContent = int.options.getString("content") || null;
	const removeContent = int.options.getBoolean("remove") || false;

	const tagsSchema = client.dbSchema.tags

	const existingTag = await client.db.query.tags.findFirst({
		where: and(
			eq(tagsSchema.id, int.user.id),
			eq(tagsSchema.name, tagName)
		)
	})

	if (existingTag) existingTag.data = JSON.parse(existingTag.data)

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

	await client.db
		.insert(tagsSchema)
		.values({
			name: tagName,
			id: int.user.id,
			data: JSON.stringify(tagData)
		})
		.onConflictDoUpdate({
			target: [tagsSchema.id, tagsSchema.name],
			set: {
				data: JSON.stringify(tagData)
			}
		})

	await int.reply({
		content: `Successfully created/updated the tag "${tagName}"`,
		ephemeral: true
	})
};
