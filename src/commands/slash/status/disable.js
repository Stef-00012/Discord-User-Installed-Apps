const fs = require("node:fs");

module.exports = async (client, int) => {
	const commandStatus = fs.readFileSync(
		`${__dirname}/../../../data/commandStatus.json`,
	);
	const commandStatusJSON = JSON.parse(commandStatus);

	const commandName = int.options.getString("command");

	if (!commandStatusJSON[commandName])
		return int.reply({
			content: `\`${commandName}\` is already disabled`,
			ephemeral: true,
		});

	commandStatusJSON[commandName] = false;

	fs.writeFileSync(
		`${__dirname}/../../../data/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	int.reply({
		content: `Successfully disabled the command \`${commandName}\``,
		ephemeral: true,
	});
};
