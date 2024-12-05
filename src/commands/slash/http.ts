import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "http",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const urls = {
			cat: "https://http.cat/{status}",
			dog: "https://httpstatusdogs.com/img/{status}.jpg",
			goat: "https://httpgoats.com/{status}.jpg",
		};

		const type = int.options.getString("type", true);
		const status = int.options.getInteger("status", true);

		await int.reply({
			content: urls[type].replace("{status}", status),
		});
	},
} as Command;
