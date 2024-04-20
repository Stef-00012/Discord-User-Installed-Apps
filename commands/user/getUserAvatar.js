const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Get User Avatar",
	requires: [],

	async execute(client, int) {
		if (!int.targetUser.avatar)
			return int.reply({
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
};
