import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import {
	EmbedBuilder,
	type UserContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Get Member Avatar",
	requires: [],

	async execute(client: Client, int: UserContextMenuCommandInteraction) {
		if (!int.targetMember?.avatar)
			return await int.reply({
				content: "The user doesn't have any avatar in this server",
				ephemeral: true,
			});

		const url = `https://cdn.discordapp.com/guilds/${int.guildId}/users/${int.targetId}/avatars/${int.targetMember.avatar}.webp`;

		const embed = new EmbedBuilder()
			.setTitle("Member Avatar")
			.setDescription(url)
			.setImage(url);

		await int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
} as Command;
