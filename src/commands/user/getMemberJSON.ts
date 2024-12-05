import { EmbedBuilder, type UserContextMenuCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "Get Member JSON",
	requires: [],

	async execute(client: Client, int: UserContextMenuCommandInteraction) {
		const memberJSON = JSON.stringify(int.targetMember, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				memberJSON.length > 4081
					? `${memberJSON.substr(0, 4081)}...`
					: memberJSON
			}\n\`\`\``,
		);

		await int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
} as Command;
