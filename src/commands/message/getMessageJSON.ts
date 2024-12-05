import { EmbedBuilder, type MessageContextMenuCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "Get Message JSON",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		const messageJSON = JSON.stringify(int.targetMessage, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${messageJSON.length > 4081
				? `${messageJSON.substr(0, 4081)}...`
				: messageJSON
			}\n\`\`\``,
		);

		await int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
} as Command;
