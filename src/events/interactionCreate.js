const { eq } = require("drizzle-orm");
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

		try {
			await cmd.execute(client, int);
		} catch (e) {
			if (e.code !== 10062) {
				if (int.deferred) {
					int.editReply({
						content: "Something went wrong...",
						components: [],
						embeds: [],
					});
				} else {
					int.reply({
						content: "Something went wrong...",
					});
				}
			}
		}

		const analyticsSchema = client.dbSchema.analytics;

		const commandAnalytics = await client.db.query.analytics.findFirst({
			where: eq(analyticsSchema.commandName, int.commandName),
		});

		if (commandAnalytics) {
			await client.db
				.update(analyticsSchema)
				.set({
					uses: commandAnalytics.uses + 1,
				})
				.where(eq(analyticsSchema.commandName, int.commandName));
		} else {
			await client.db.insert(analyticsSchema).values({
				commandName: int.commandName,
				uses: 1,
			});
		}
	}

	if (int.isAutocomplete()) {
		const cmd = client.commands.get(int.commandName);

		if (!cmd) return;

		try {
			await cmd.autocomplete(client, int);
		} catch(e) {
			if (e.code !== 10062) {
				await int.respond([])
			}
		}
	}
};
