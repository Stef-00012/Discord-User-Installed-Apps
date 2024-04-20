const fs = require("node:fs");

module.exports = async (client, int) => {
	const commandStatus = fs.readFileSync(
		`${__dirname}/../data/commandStatus.json`,
	);
	const commandStatusJSON = JSON.parse(commandStatus);

	if (
		!commandStatusJSON[int.commandName] &&
		(int.isChatInputCommand() ||
			int.isMessageContextMenuCommand() ||
			int.isUserContextMenuCommand())
	)
		return int.reply({
			content: "This command is disabled",
			ephemeral: true,
		});

	if (int.isChatInputCommand()) {
		const commandPermissions = fs.readFileSync(
			`${__dirname}/../data/commandPermissions.json`,
		);
		const commandPermissionsJSON = JSON.parse(commandPermissions);

		if (!commandPermissionsJSON[int.commandName]) {
			commandPermissionsJSON[int.commandName] = [];

			fs.writeFileSync(
				`${__dirname}/../data/commandPermissions.json`,
				JSON.stringify(commandPermissionsJSON, null, 2),
			);
		}

		if (
			commandPermissionsJSON[int.commandName].length &&
			!commandPermissionsJSON[int.commandName].includes(int.user.id)
		)
			return int.reply({
				ephemeral: true,
				content: "You're not allowed to run this command",
			});

		const cmd = client.commands.get(int.commandName);

		if (!cmd)
			return int.reply({
				ephemeral: true,
				content: "I couldn't find this command",
			});

		cmd.execute(client, int);
	}

	if (int.isAutocomplete()) {
		const cmd = client.commands.get(int.commandName);

		if (!cmd) return;

		cmd.autocomplete(client, int);
	}

	if (int.isMessageContextMenuCommand()) {
		const commandPermissions = fs.readFileSync(
			`${__dirname}/../data/commandPermissions.json`,
		);
		const commandPermissionsJSON = JSON.parse(commandPermissions);

		if (!commandPermissionsJSON[int.commandName]) {
			commandPermissionsJSON[int.commandName] = [];

			fs.writeFileSync(
				`${__dirname}/../data/commandPermissions.json`,
				JSON.stringify(commandPermissionsJSON, null, 2),
			);
		}

		if (
			commandPermissionsJSON[int.commandName].length &&
			!commandPermissionsJSON[int.commandName].includes(int.user.id)
		)
			return int.reply({
				ephemeral: true,
				content: "You're not allowed to run this command",
			});

		const cmd = client.messageCommands.get(int.commandName);

		if (!cmd)
			return int.reply({
				ephemeral: true,
				content: "I couldn't find this command",
			});

		cmd.execute(client, int);
	}

	if (int.isUserContextMenuCommand()) {
		const commandPermissions = fs.readFileSync(
			`${__dirname}/../data/commandPermissions.json`,
		);
		const commandPermissionsJSON = JSON.parse(commandPermissions);

		if (!commandPermissionsJSON[int.commandName]) {
			commandPermissionsJSON[int.commandName] = [];

			fs.writeFileSync(
				`${__dirname}/../data/commandPermissions.json`,
				JSON.stringify(commandPermissionsJSON, null, 2),
			);
		}

		if (
			commandPermissionsJSON[int.commandName].length &&
			!commandPermissionsJSON[int.commandName].includes(int.user.id)
		)
			return int.reply({
				ephemeral: true,
				content: "You're not allowed to run this command",
			});

		const cmd = client.userCommands.get(int.commandName);

		if (!cmd)
			return int.reply({
				ephemeral: true,
				content: "I couldn't find this command",
			});

		cmd.execute(client, int);
	}
};
