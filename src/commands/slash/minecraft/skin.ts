import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "../../../structures/DiscordClient";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const player = int.options.getString("player", true);
	const renderType = int.options.getString("render-type", true);
	const cropType = int.options.getString("crop-type", true);

	const avaibleCropTypes = {
		default: ["full", "bust", "face"],
		marching: ["full", "bust", "face"],
		walking: ["full", "bust", "face"],
		crouching: ["full", "bust", "face"],
		crossed: ["full", "bust", "face"],
		criss_cross: ["full", "bust", "face"],
		ultimate: ["full", "bust", "face"],
		isometric: ["full", "bust", "face", "head"],
		head: ["full"],
		cheering: ["full", "bust", "face"],
		relaxing: ["full", "bust", "face"],
		trudging: ["full", "bust", "face"],
		cowering: ["full", "bust", "face"],
		pointing: ["full", "bust", "face"],
		lunging: ["full", "bust", "face"],
		dungeons: ["full", "bust", "face"],
		facepalm: ["full", "bust", "face"],
		sleeping: ["full", "bust"],
		dead: ["full", "bust", "face"],
		archer: ["full", "bust", "face"],
		kicking: ["full", "bust", "face"],
		mojavatar: ["full", "bust"],
		reading: ["full", "bust", "face"],
		bitzel: ["full", "bust", "face"],
		pixel: ["full", "bust", "face"],
		ornament: ["full"],
		skin: ["default", "processed"],
	};

	if (!avaibleCropTypes[renderType].includes(cropType))
		return await int.reply({
			content: "Invalid crop type",
			ephemeral: true,
		});

	const url = `https://starlightskins.lunareclipse.studio/render/${renderType}/${player}/${cropType}`;

	const embed = new EmbedBuilder()
		.setAuthor({
			name: "Minecraft Player Skin",
		})
		.setTitle(player)
		.setImage(url)
		.addFields([
			{
				name: "Render Type",
				value: renderType.replace(/_/g, " "),
				inline: true,
			},
			{
				name: "Crop Type",
				value: cropType,
				inline: true,
			},
		]);

	await int.reply({
		embeds: [embed],
	});
}
