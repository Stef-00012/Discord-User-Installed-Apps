import type { ChatInputCommandInteraction } from "discord.js";
import type { ZiplineRequestData } from "../../types/zipline";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import axios from "axios";

export default {
	name: "shorten",
	requires: ["zipline"],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		if (!client.config.zipline)
			return await int.reply({
				content: "Missing Zipline auth data",
			});

		const domain = client.config.zipline.url;
		const token = client.config.zipline.token;

		const ephemeral = int.options.getBoolean("ephemeral") || false;
		const url = int.options.getString("url", true);
		const vanity = int.options.getString("vanity");

		if (["http://", "https://"].every((protocol) => !url.startsWith(protocol)))
			return await int.reply({
				content: "Yo must use a valid URL",
				ephemeral: true,
			});

		await int.deferReply({
			ephemeral,
		});

		const data = {
			url,
		} as ZiplineRequestData;

		if (vanity) data.vanity = vanity;

		try {
			const shortenResponse = await axios.post(`${domain}/api/shorten`, data, {
				headers: {
					Authorization: token,
					"content-type": "application/json",
				},
			});

			await int.editReply({
				content: `[Your URL](${shortenResponse.data.url}) has been shortened\nURL: ${shortenResponse.data.url}`,
			});
		} catch (e) {
			console.error(e);

			await int.editReply({
				content: "Something went wrong...",
			});
		}
	},
} as Command;
