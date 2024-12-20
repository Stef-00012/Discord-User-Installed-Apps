import type { PterodactylPowerActions } from "../../../../types/pterodactyl";
import type { Client } from "../../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import { eq } from "drizzle-orm";
import axios from "axios";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const id = int.options.getString("id", true);
	const action = int.options.getString(
		"action",
		true,
	) as PterodactylPowerActions;

	await int.deferReply();

	const pteroSchema = client.dbSchema.ptero;

	const userPteroData = await client.db.query.ptero.findFirst({
		where: eq(pteroSchema.id, int.user.id),
	});

	if (!userPteroData)
		return await int.editReply({
			content: "Your Pterodactyl config are incorrect",
		});

	const panelUrl = userPteroData.panelUrl;
	const apiKey = userPteroData.apiKey;

	try {
		await axios.post(
			`${panelUrl}/api/client/servers/${id}/power`,
			{
				signal: action,
			},
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);

		await int.editReply({
			content: `Successfully ran the \`${action}\` power action on the server with ID \`${id}\``,
		});
	} catch (e) {
		if (e?.response?.status === 401)
			return await int.editReply({
				content: "Your API key is not valid",
			});

		console.log(e);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}
