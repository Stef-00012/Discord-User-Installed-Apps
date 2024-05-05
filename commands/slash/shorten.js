const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
	name: "shorten",
	requires: ["zipline"],

	async execute(client, int) {
		const domain = client.config.zipline.url;
		const token = client.config.zipline.token;

		const ephemeral = int.options.getBoolean("ephemeral") || false;
		const url = int.options.getString("url");
		const vanity = int.options.getString("vanity");

		if (["http://", "https://"].every((protocol) => !url.startsWith(protocol)))
			return int.reply({
				content: "Yo must use a valid URL",
				ephemeral: true,
			});

		await int.deferReply({
			ephemeral,
		});

		const data = {
			url,
		};

		if (vanity) data.vanity = vanity;

		try {
			const shortenResponse = await axios.post(`${domain}/api/shorten`, data, {
				headers: {
					Authorization: token,
					"content-type": "application/json",
				},
			});

			int.editReply({
				content: `[Your URL](${shortenResponse.data.url}) has been shortened\nURL: ${shortenResponse.data.url}`,
			});
		} catch (e) {
			console.error(e);

			int.editReply({
				content: "Something went wrong...",
			});
		}
	},
};
