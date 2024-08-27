const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Get User JSON",
	requires: [],

	async execute(client, int) {
		const userJSON = JSON.stringify(int.targetUser, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				userJSON.length > 4081 ? `${userJSON.substr(0, 4081)}...` : userJSON
			}\n\`\`\``,
		);

		int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
