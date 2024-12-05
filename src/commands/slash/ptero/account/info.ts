import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios";
import { eq } from "drizzle-orm";
import type { Client } from "../../../../structures/DiscordClient";
import type { PterodactylAccount } from "../../../../types/pterodactyl";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const showMail = int.options.getBoolean("mail") || false;

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
		const res = await axios.get(`${panelUrl}/api/client/account`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});

		const data: PterodactylAccount = res.data.attributes;

		const embed = new EmbedBuilder()
			.setTitle("Account Information")
			.setDescription(
				`**ID**: \`${data.id}\`\n**Admin**: ${
					data.admin ? "Yes" : "No"
				}\n**Username**: ${data.username}\n**Mail**: \`${
					showMail ? data.email : "<hidden>"
				}\`\n**Full Name**: ${data.first_name} ${
					data.last_name
				}\n**Language**: \`${data.language}\``,
			);

		await int.editReply({
			embeds: [embed],
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
};
