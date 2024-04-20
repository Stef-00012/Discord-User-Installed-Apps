const fs = require("node:fs");

module.exports = async (client, int) => {
	const commandPermissions = fs.readFileSync(
		`${__dirname}/../../../data/commandPermissions.json`,
	);
	const commandPermissionsJSON = JSON.parse(commandPermissions);

	const commandName = int.options.getString("command");
	const user = int.options.getString("user");

	if (!commandPermissionsJSON[commandName])
		commandPermissionsJSON[commandName] = [];

	// if (client.config.owners.includes(user)) return int.reply({
	//     content:`\`${user}\` is one of the owners, you can't manage their permissions`,
	//     ephemeral: true
	// })

	if (!commandPermissionsJSON[commandName].includes(user))
		return int.reply({
			content: `\`${user}\` is already not allowed to use this command`,
			ephemeral: true,
		});

	commandPermissionsJSON[commandName] = commandPermissionsJSON[
		commandName
	].filter((usr) => usr !== user);

	fs.writeFileSync(
		`${__dirname}/../../../data/commandPermissions.json`,
		JSON.stringify(commandPermissionsJSON, null, 2),
	);

	int.reply({
		content: `Successfully removed \`${user}\` from the users who can run the command \`${commandName}\``,
		ephemeral: true,
	});
};
