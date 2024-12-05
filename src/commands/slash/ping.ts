import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "ping",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		await int.reply({
			content: `My ping is ${client.ws.ping}ms`,
		});
	},
} as Command;
