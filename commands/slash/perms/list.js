const {
	EmbedBuilder
} = require("discord.js");
const fs = require("node:fs");

module.exports = async (client, int) => {
	const commandPermissions = fs.readFileSync(
		`${__dirname}/../../../data/commandPermissions.json`,
	);
	const commandPermissionsJSON = JSON.parse(commandPermissions);

	const commands = require("../../../commands.js");

	const embed = new EmbedBuilder().setTitle("Command Permissions");

	let description = "";

	for (const command of commands) {
		if (
			!commandPermissionsJSON[command.name] ||
			!commandPermissionsJSON[command.name].length
		) {
			description += `## ${command.name}\n- Everyone\n`;
		} else {
			description += `## ${command.name}\n- ${commandPermissionsJSON[
				command.name
			]
				.map((id) => `\`${id}\``)
				.join(", ")}\n`;
		}
	}

	embed.setDescription(description);

	int.reply({
		embeds: [embed],
		ephemeral: true,
	});
};
