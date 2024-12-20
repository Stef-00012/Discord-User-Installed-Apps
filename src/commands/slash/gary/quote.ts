import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply();

	try {
		const res = await axios.get("https://garybot.dev/api/quote");

		const quote: string = res.data.quote;

		await int.editReply({
			content: `Here's your Gary's quote\n> ${quote}`,
		});
	} catch (e) {
		if (e?.response?.status === 429)
			return await int.editReply({
				content: "You are being ratelimited",
			});

		if (e?.response?.status === 500)
			return await int.editReply({
				content: "The Gary API is currently having issues",
			});

		if (e?.response?.status)
			return await int.editReply({
				content: `The Gary API request failed with status ${e.response.status} (${e.response.statusText})`,
			});

		console.log(e);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}
