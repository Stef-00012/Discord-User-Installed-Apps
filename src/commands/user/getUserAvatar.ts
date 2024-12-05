import { EmbedBuilder, type UserContextMenuCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "Get User Avatar",
	requires: [],

	async execute(client: Client, int: UserContextMenuCommandInteraction) {
		if (!int.targetUser.avatar)
			return await int.reply({
				content: "The user doesn't have any avatar",
				ephemeral: true,
			});

		const url = int.targetUser.displayAvatarURL();

		const embed = new EmbedBuilder()
			.setTitle("User Avatar")
			.setDescription(url)
			.setImage(url);

		await int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
} as Command;
