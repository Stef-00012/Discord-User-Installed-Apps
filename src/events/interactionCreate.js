const fs = require("node:fs");

module.exports = async (client, int) => {
	const commandStatus = fs.readFileSync(
		`${__dirname}/../data/commandStatus.json`,
	);
	const commandStatusJSON = JSON.parse(commandStatus);

	if (
		!commandStatusJSON[int.commandName] &&
		(
			int.isChatInputCommand() ||
			int.isMessageContextMenuCommand() ||
			int.isUserContextMenuCommand()
		)
	)
		return int.reply({
			content: "This command is disabled",
			ephemeral: true,
		});

	if (
		int.isChatInputCommand() ||
		int.isUserContextMenuCommand() ||
		int.isMessageContextMenuCommand()
	) {
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

		if (client.mongo.isConnected()) {
			let commandAnalytics = await client.mongo.analytics.findOne({
				commandName: int.commandName
			})
	
			if (!commandAnalytics) commandAnalytics = new client.mongo.analytics({
				commandName: int.commandName
			})
	
			commandAnalytics.uses += 1;
	
			await commandAnalytics.save()
		}
	}

	if (int.isAutocomplete()) {
		const cmd = client.commands.get(int.commandName);

		if (!cmd) return;

		cmd.autocomplete(client, int);
	}
};
