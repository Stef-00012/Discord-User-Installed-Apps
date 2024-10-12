const { AttachmentBuilder } = require("discord.js");
const { eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	await int.deferReply({
		ephemeral: true,
	});

	const tagsSchema = client.dbSchema.tags;

	const userTags = await client.db.query.tags.findMany({
		where: eq(tagsSchema.id, int.user.id),
	});

	if (!userTags || userTags?.length <= 0)
		return await int.editReply({
			content: "You have no tags",
			ephemeral: true,
		});

	const formattedTags = userTags.map((tag) => ({
		name: tag.name,
		data: JSON.parse(tag.data),
	}));

	const stringifiedTags = JSON.stringify(formattedTags, null, 4);

	const attachment = new AttachmentBuilder(Buffer.from(stringifiedTags), {
		name: `tags_${int.user.id}.json`,
	});

	await int.editReply({
		files: [attachment],
	});
};
