const { and, eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	const tagName = int.options.getString("name");
	const ephemeral = int.options.getBoolean("ephemeral") || false;

	const tagsSchema = client.dbSchema.tags;

	const existingTag = await client.db.query.tags.findFirst({
		where: and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
	});

	if (!existingTag)
		return await int.reply({
			content: "This tag doesn't exist",
			ephemeral: true,
		});

	existingTag.data = JSON.parse(existingTag.data);

	if (existingTag.data?.embeds)
		existingTag.data.embeds = existingTag.data.embeds.filter(
			(embed) => Object.entries(embed).length > 0,
		);

	await int.reply({
		...existingTag.data,
		ephemeral,
	});
};
