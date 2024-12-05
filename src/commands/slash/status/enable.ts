import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import type { CommandStatus } from "../../../types/permissions";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const commandStatusJSON: CommandStatus = await Bun.file(`${__dirname}/../../../data/permissions/commandStatus.json`).json();

	const commandName = int.options.getString("command", true);

	if (commandStatusJSON[commandName])
		return await int.reply({
			content: `\`${commandName}\` is already enabled`,
			ephemeral: true,
		});

	const commandData = client.commands.get(commandName);

	if (!commandData) return int.reply({
		content: "Invalid Command"
	})

	if (
		commandData.requires.includes("naviac") &&
		["username", "token"].some((cfg) => !client.config?.naviac?.[cfg])
	) {
		return await int.reply({
			content:
				"You must add a N.A.V.I.A.C. username and token in order to be able to enable this command",
			ephemeral: true,
		});
	}

	if (
		commandData.requires.includes("zipline") &&
		["token", "url", "chunkSize", "maxFileSize"].some(
			(cfg) => !client.config?.zipline?.[cfg],
		)
	) {
		return await int.reply({
			content:
				"You must add your zipline token, url and chunk size in order to be able to enable this command",
			ephemeral: true,
		});
	}

	commandStatusJSON[commandName] = true;

	Bun.write(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	await int.reply({
		content: `Successfully enabled the command \`${commandName}\``,
		ephemeral: true,
	});
};
