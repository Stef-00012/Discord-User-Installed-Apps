import qrcode from "qrcode-terminal";
import axios from "axios";
import { AttachmentBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "qr",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const text = int.options.getString("text", true);
		const type = int.options.getString("type") || "text";

		switch (type) {
			case "text": {
				qrcode.generate(
					text,
					{
						small: true,
					},
					(code) => {
						int.reply({
							content: `\`\`\`txt\n${code}\n\`\`\``,
						});
					},
				);

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
					return await int.reply({
						content: "The API did not return any QR code",
						ephemeral: true,
					});

				const attachment = new AttachmentBuilder(req.data)

				await int.reply({
					files: [attachment],
				});

				break;
			}
		}
	},
} as Command;
