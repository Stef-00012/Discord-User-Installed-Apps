import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import axios from "axios";
import os from "node:os";
import fs from "node:fs";
import {
	AttachmentBuilder,
	MessageFlags,
	type MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Download Voice Message",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		const tmpFolder = os.tmpdir();
		const tmpPath = `${tmpFolder}/downloadAudio.ogg`;
		const tmpPathOutput = `${tmpFolder}/downloadAudio.mp3`;

		if (!int.targetMessage.flags.has(MessageFlags.IsVoiceMessage))
			return int.reply({
				content: "This message is not a voice message",
				ephemeral: true,
			});

		const attachment = int.targetMessage.attachments.first();

		if (!attachment)
			return int.reply({
				content: "This message has no files",
				ephemeral: true,
			});

		await int.deferReply({
			ephemeral: true,
		});

		const { data } = await axios.get(attachment.url, {
			responseType: "arraybuffer",
			headers: {
				"Content-Type": "audio/ogg",
			},
		});

		try {
			await Bun.write(tmpPath, data);

			await client.functions.oggToMp3(tmpPath, tmpPathOutput);
		} catch (e) {
			console.log(e);

			return int.editReply({
				content: "Something went wrong while fetching the voice message...",
			});
		}

		const mp3Attachment = new AttachmentBuilder(tmpPathOutput, {
			name: "voice-message.mp3",
		});

		await int.editReply({
			files: [mp3Attachment],
		});

		fs.unlinkSync(tmpPath);
		fs.unlinkSync(tmpPathOutput);
	},
} as Command;
