const { execSync } = require("node:child_process");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "console",
	requires: [],

	async execute(client, int) {
		const cmd = int.options.getString("command");
		const ephemeral = int.options.getBoolean("personal");

		await int.deferReply({
			ephemeral,
		});

		const embed = new EmbedBuilder();

		const fields = [
			{
				name: "Command:",
				value: `\`\`\`ansi\n${cmd}\n\`\`\``,
			},
		];

		let output;

		try {
			output = execSync(cmd).toString().trim();
		} catch (e) {
			let error = e.toString().trim();

			if (error.length > 1000) {
				console.log(`\n\nError Message:\n${error}`);

				error = error.substr(0, 1000);
			}

			fields.push({
				name: "Error:",
				value: `\`\`\`ansi\n${error}\n\`\`\``,
			});

			embed.setFields(fields);

			return await int.editReply({
				embeds: [embed],
			});
		}

		if (output.length > 1000) {
			console.log(`\n\nStdout:\n${output}`);

			output = output.substr(0, 1000);
		}

		fields.push({
			name: "StdOut:",
			value: `\`\`\`ansi\n${output}\n\`\`\``,
		});

		embed.setFields(fields)

		await int.editReply({
			embeds: [embed],
		});
	},
};
