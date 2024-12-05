import axios from "axios";
import crypto from "node:crypto";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";


export default {
	name: "animal",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		let type = int.options.getString("type");
		let pic: string;

		const types = ["cat", "dog", "fox", "duck"];

		if (!type) type = types[crypto.randomInt(0, types.length)];

		await int.deferReply();

		switch (type) {
			case "fox": {
				const data = await axios.get("https://randomfox.ca/floof");

				pic = data.data.image;

				break;
			}

			case "duck": {
				const data = await axios.get("https://random-d.uk/api/v2/random");

				pic = data.data.url;

				break;
			}

			case "cat": {
				const data = await axios.get(
					"https://api.thecatapi.com/v1/images/search",
				);

				pic = data.data[0].url;

				break;
			}

			case "dog": {
				const data = await axios.get("https://dog.ceo/api/breeds/image/random");

				pic = data.data.message;

				break;
			}

			default: {
				const data = await axios.get(
					"https://api.thecatapi.com/v1/images/search",
				);

				pic = data.data[0].url;

				break;
			}
		}

		const embed = new EmbedBuilder().setImage(pic).setTitle(`Random ${type}`);

		await int.editReply({
			embeds: [embed],
		});
	},
} as Command;
