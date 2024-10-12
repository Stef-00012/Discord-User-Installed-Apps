const path = require("node:path");
const fs = require("node:fs");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "export",
	requires: [],

	async execute(client, int) {
		const inputPath = int.options.getString("path");

		const filePath = path.join(process.cwd(), inputPath);

		if (!fs.existsSync(filePath))
			return await int.reply({
				content: "This file doesn't exist",
			});

		const attachment = new AttachmentBuilder()
			.setFile(filePath)
			.setName(path.basename(filePath));

		await int.deferReply();

		await int.editReply({
			content: `<https://github.com/stef-00012/discord-user-installed-apps/blob/main/${
				inputPath.startsWith("/") ? inputPath.replace("/", "") : inputPath
			}>`,
			files: [attachment],
		});
	},
};
