const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Get Message JSON",
	requires: [],

	async execute(client, int) {
		const messageJSON = JSON.stringify(int.targetMessage, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				messageJSON.length > 4081
					? `${messageJSON.substr(0, 4081)}...`
					: messageJSON
			}\n\`\`\``,
		);

		int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
