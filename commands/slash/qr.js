const qrcode = require("qrcode-terminal");
const axios = require("axios");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "qr",
	requires: [],

	async execute(client, int) {
		const text = int.options.getString("text");
		const type = int.options.getString("type") || "text";

		switch (type) {
			case "text": {
				let qr;

				qrcode.generate(
					text,
					{
						small: true,
					},
					(code) => {
						qr = code;
					},
				);

				int.reply({
					content: `\`\`\`txt\n${qr}\n\`\`\``,
				});

				break;
			}

			case "image": {
				const encodedText = encodeURIComponent(text);

				const req = await axios.get(
					`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedText}`,
					{
						responseType: "arraybuffer",
					},
				);

				if (!req.data)
					return int.reply({
						content: "The API did not return any QR code",
						ephemeral: true,
					});

				const attachment = new AttachmentBuilder().setFile(req.data);

				int.reply({
					files: [attachment],
				});

				break;
			}
		}
	},
};
