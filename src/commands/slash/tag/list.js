const { eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	const tagsSchema = client.dbSchema.tags

	const userTags = await client.db.query.tags.findMany({
		where: eq(tagsSchema.id, int.user.id)
	}) || []

	if (userTags.length === 0)
		return int.reply({
			content: "You have no tags",
			ephemeral: true,
		});

	const tagsString = userTags.map((tag) => tag.name).join("\n- ");

	int.reply({
		content: `Your tags are:\n- ${
			tagsString.length > 1950 ? `${tagsString.substr(0, 1950)}...` : tagsString
		}`,
		ephemeral: true,
	});
};
