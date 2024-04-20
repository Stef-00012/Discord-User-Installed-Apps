const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Get Member JSON",
	requires: [],

	async execute(client, int) {
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

		int.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
