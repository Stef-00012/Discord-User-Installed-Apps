const fs = require("node:fs");
const startMongo = require(`${__dirname}/../../../mongo/start.js`);

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
				content:
					"\x1b[31mYou must add a MongoDB url in order to be able to enable this command\x1b[0m",
				ephemeral: true,
			});

		if (!client.mongo.isConnected()) startMongo(client);
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
