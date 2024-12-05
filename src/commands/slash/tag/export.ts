import { AttachmentBuilder, type ChatInputCommandInteraction } from "discord.js";
import { eq } from "drizzle-orm";
import type { Client } from "../../../structures/DiscordClient";
import type { Tag, TagData } from "../../../types/tag";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	await int.deferReply({
		ephemeral: true,
	});

	const tagsSchema = client.dbSchema.tags;

	const userTags = await client.db.query.tags.findMany({
		where: eq(tagsSchema.id, int.user.id),
	}) as Array<Tag> || [];

	if (!userTags || userTags.length <= 0)
		return await int.editReply({
			content: "You have no tags",
		});

	const formattedTags = userTags.map((tag) => ({
		name: tag.name,
		data: JSON.parse(tag.data) as TagData,
	}));

	const stringifiedTags = JSON.stringify(formattedTags, null, 4);

	const attachment = new AttachmentBuilder(Buffer.from(stringifiedTags), {
		name: `tags_${int.user.id}.json`,
	});

	await int.editReply({
		files: [attachment],
	});
};
