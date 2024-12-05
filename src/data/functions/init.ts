import fs from "node:fs";
import cmds from "../../commands";
import config from "../../../config";

export default function(): void {
	if (!fs.existsSync(`${__dirname}/../permissions/commandPermissions.json`)) {
		const commandPermissions = {
			eval: config.owners,
			perms: config.owners,
			status: config.owners,
			console: config.owners,
		};

		fs.writeFileSync(
			`${__dirname}/../permissions/commandPermissions.json`,
			JSON.stringify(commandPermissions, null, 4),
		);
	}

	if (!fs.existsSync(`${__dirname}/../permissions/commandStatus.json`)) {
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
			`${__dirname}/../permissions/commandStatus.json`,
			JSON.stringify(commandStatus, null, 4),
		);
	}
};
