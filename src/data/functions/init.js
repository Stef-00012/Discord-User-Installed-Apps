const fs = require("node:fs");
const cmds = require("../../commands.js");
const config = require("../../../config.js");

module.exports = () => {
	if (!fs.existsSync(`${__dirname}/../commandPermissions.json`)) {
		const commandPermissions = {
			eval: config.owners,
			perms: config.owners,
			status: config.owners,
			console: config.owners,
		};

		fs.writeFileSync(
			`${__dirname}/../commandPermissions.json`,
			JSON.stringify(commandPermissions, null, 4),
		);
	}

	if (!fs.existsSync(`${__dirname}/../commandStatus.json`)) {
		const commands = cmds.map((cmd) => cmd.name);

		let commandStatus = {};

		for (const command of commands) {
			commandStatus[command] = true;
		}

		commandStatus = {
			...commandStatus,
			ask: false,
			upload: false,
			shorten: false,
		};

		fs.writeFileSync(
			`${__dirname}/../commandStatus.json`,
			JSON.stringify(commandStatus, null, 4),
		);
	}
};
