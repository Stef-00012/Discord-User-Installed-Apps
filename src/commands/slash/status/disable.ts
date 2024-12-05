import fs from "node:fs";
import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import type { CommandStatus } from "../../../types/status";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const commandStatus = fs.readFileSync(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
	).toString();
	const commandStatusJSON: CommandStatus = JSON.parse(commandStatus);

	const commandName = int.options.getString("command", true);

	if (!commandStatusJSON[commandName])
		return await int.reply({
			content: `\`${commandName}\` is already disabled`,
			ephemeral: true,
		});

	commandStatusJSON[commandName] = false;

	fs.writeFileSync(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	await int.reply({
		content: `Successfully disabled the command \`${commandName}\``,
		ephemeral: true,
	});
};
