const fs = require("node:fs");
const startMongo = require('../../../mongo/start.js')

module.exports = async (client, int) => {
	const commandStatus = fs.readFileSync(
		`${__dirname}/../../../data/commandStatus.json`,
	);
	const commandStatusJSON = JSON.parse(commandStatus);

	const commandName = int.options.getString("command");

	if (commandStatusJSON[commandName])
		return int.reply({
			content: `\`${commandName}\` is already enabled`,
			ephemeral: true,
		});

	const commandData = client.commands.get(commandName);

	if (commandData.requires.includes("mongo")) {
		if (!client.config.mongo)
			return int.reply({
				content: "You must add a MongoDB url in order to be able to enable this command",
				ephemeral: true,
			});

		if (!client.mongo.isConnected()) startMongo(client);
	}

	if (
		commandData.requires.includes("naviac") &&
		["username", "token"].some((cfg) => !client.config?.naviac?.[cfg])
	) {
		return int.reply({
			content: "You must add a N.A.V.I.A.C. username and token in order to be able to enable this command",
			ephemeral: true,
		});
	}

	if (
		commandData.requires.includes("gary") &&
		!client.config?.gary?.apiKey
	) {
		return int.reply({
			content: "You must add a Gary API key in order to be able to enable this command",
			ephemeral: true,
		});
	}

	if (
		commandData.requires.includes("zipline") &&
		["token", "url", "chunkSize", "maxFileSize"].some(
			(cfg) => !client.config?.zipline?.[cfg],
		)
	) {
		return int.reply({
			content: "You must add your zipline token, url and chunk size in order to be able to enable this command",
			ephemeral: true,
		});
	}

	commandStatusJSON[commandName] = true;

	fs.writeFileSync(
		`${__dirname}/../../../data/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	int.reply({
		content: `Successfully enabled the command \`${commandName}\``,
		ephemeral: true,
	});
};
