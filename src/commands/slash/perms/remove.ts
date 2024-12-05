import fs from "node:fs";
import type { Client } from "../../../structures/DiscordClient";
import type { ChatInputCommandInteraction } from "discord.js";
import type { CommandPermissions } from "../../../types/permissions";

export default async function(client: Client, int: ChatInputCommandInteraction) {
	const commandPermissions = fs.readFileSync(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
	).toString();
	const commandPermissionsJSON = JSON.parse(commandPermissions) as CommandPermissions;

	const commandName = int.options.getString("command", true);
	const user = int.options.getString("user", true);

	if (!commandPermissionsJSON[commandName])
		commandPermissionsJSON[commandName] = [];

	// if (client.config.owners.includes(user)) return int.reply({
	//     content:`\`${user}\` is one of the owners, you can't manage their permissions`,
	//     ephemeral: true
	// })

	if (!commandPermissionsJSON[commandName].includes(user))
		return await int.reply({
			content: `\`${user}\` is already not allowed to use this command`,
			ephemeral: true,
		});

	commandPermissionsJSON[commandName] = commandPermissionsJSON[
		commandName
	].filter((usr) => usr !== user);

	fs.writeFileSync(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
		JSON.stringify(commandPermissionsJSON, null, 2),
	);

	await int.reply({
		content: `Successfully removed \`${user}\` from the users who can run the command \`${commandName}\``,
		ephemeral: true,
	});
};
