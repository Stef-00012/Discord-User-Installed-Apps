const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Get Member Avatar",
	requires: [],

	async execute(client, int) {
		if (!int.targetMember.avatar)
			return int.reply({
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
};
