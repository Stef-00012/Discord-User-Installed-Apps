import type { Client } from "../../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	let panelUrl = int.options.getString("url", true);
	const apiKey = int.options.getString("key", true);

	if (!panelUrl.startsWith("http://") && !panelUrl.startsWith("https://"))
		return await int.reply({
			content: "The provided panel URL is invalid",
			ephemeral: true,
		});

	panelUrl = panelUrl.split("/").slice(0, 3).join("/");

	if (!apiKey.startsWith("ptlc_"))
		return await int.reply({
			content: "Invalid API key",
			ephemeral: true,
		});

	await int.deferReply({
		ephemeral: true,
	});

	const userPteroData = {
		panelUrl,
		apiKey,
	};

	const pteroSchema = client.dbSchema.ptero;

	await client.db
		.insert(pteroSchema)
		.values({
			id: int.user.id,
			...userPteroData,
		})
		.onConflictDoUpdate({
			target: pteroSchema.id,
			set: userPteroData,
		});

	await int.editReply({
		content: "Successfully saved your pterodactyl config",
	});
}
