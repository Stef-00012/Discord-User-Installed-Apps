const { eq, and } = require("drizzle-orm");

module.exports = async (client, int) => {
	const tagName = int.options.getString("name");

	const tagsSchema = client.dbSchema.tags

	const existingTag = await client.db.query.tags.findFirst({
		where: and(
			eq(tagsSchema.id, int.user.id),
			eq(tagsSchema.name, tagName)
		)
	})

	if (!existingTag)
		return int.reply({
			content: "This tag doesn't exist",
			ephemeral: true,
		});

	await client.db
		.delete(tagsSchema)
		.where(
			and(
				eq(tagsSchema.id, int.user.id),
				eq(tagsSchema.name, tagName)
			)
		)

	int.reply({
		content: `Successfully deleted the tag \`${tagName}\``,
		ephemeral: true,
	});
};
