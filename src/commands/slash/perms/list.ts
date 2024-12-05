import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import fs from "node:fs";
import type { Client } from "../../../structures/DiscordClient";
import type { CommandPermissions } from "../../../types/permissions";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const commandPermissions = fs.readFileSync(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
	).toString();
	const commandPermissionsJSON = JSON.parse(commandPermissions) as CommandPermissions;

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

	await int.reply({
		embeds: [embed],
		ephemeral: true,
	});
};
