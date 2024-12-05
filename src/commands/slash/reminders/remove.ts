import { and, eq } from "drizzle-orm";
import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";

export default async function (client: Client, int: ChatInputCommandInteraction) {
	await int.deferReply({
		ephemeral: true,
	});

	const reminderId = int.options.getString("id", true);

	const remindersSchema = client.dbSchema.reminders;

	const reminder = await client.db.query.reminders.findFirst({
		where: and(
			eq(remindersSchema.userId, int.user.id),
			eq(remindersSchema.reminderId, reminderId),
		),
	});

	if (!reminder)
		return await int.editReply({
			content: `There is no reminder with this id (\`${reminderId}\`)`,
		});

	await client.db
		.delete(remindersSchema)
		.where(
			and(
				eq(remindersSchema.userId, int.user.id),
				eq(remindersSchema.reminderId, reminderId),
			),
		);

	await int.editReply({
		content: `Successfully deleted the reminder with the id \`${reminderId}\``,
	});
};
