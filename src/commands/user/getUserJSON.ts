import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import {
	EmbedBuilder,
	type UserContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Get User JSON",
	requires: [],

	async execute(client: Client, int: UserContextMenuCommandInteraction) {
		const userJSON = JSON.stringify(int.targetUser, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				userJSON.length > 4081 ? `${userJSON.substr(0, 4081)}...` : userJSON
			}\n\`\`\``,
		);

		await int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
} as Command;
