import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import type { CommandStatus } from "../../../types/permissions";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const commandStatusJSON: CommandStatus = await Bun.file(`${__dirname}/../../../data/permissions/commandStatus.json`).json();

	const commandName = int.options.getString("command", true);

	if (!commandStatusJSON[commandName])
		return await int.reply({
			content: `\`${commandName}\` is already disabled`,
			ephemeral: true,
		});

	commandStatusJSON[commandName] = false;

	Bun.write(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	await int.reply({
		content: `Successfully disabled the command \`${commandName}\``,
		ephemeral: true,
	});
};
