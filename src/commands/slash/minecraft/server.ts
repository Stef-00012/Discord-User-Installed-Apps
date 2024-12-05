import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "../../../structures/DiscordClient";
import type { McstatusIoBedrockServerResponse, McstatusIoJavaServerResponse } from "../../../types/mcstatus.io";

export default async function (client: Client, int: ChatInputCommandInteraction) {
	const serverVersion = int.options.getString("version");
	const serverAddress = int.options.getString("address");

	await int.deferReply();

	switch (serverVersion) {
		case "java": {
			try {
				const status: McstatusIoJavaServerResponse | null =
					await client.functions.getMCJavaServerStatus(serverAddress);

				if (!status) return int.editReply({
					content: `Unable to find the server \`${serverAddress}\``
				})

				const embed = new EmbedBuilder()
					.setTitle(
						`${status.host}${status.port === 25565 ? "" : `:${status.port}`}`,
					)
					.setAuthor({
						name: "Minecraft Java Server",
					})
					.setThumbnail(`https://api.mcstatus.io/v2/icon/${serverAddress}`)
					.setImage(`https://api.mcstatus.io/v2/widget/java/${serverAddress}`)
					.addFields([
						{
							name: "Status",
							value: status.online ? "Online" : "Offline",
						},
					]);

				if (status.online) {
					embed.addFields([
						{
							name: "Version",
							value: status.version?.name_clean || "Unknown",
						},
						{
							name: "Players",
							value: `${status.players.online}/${status.players.max}`,
						},
						{
							name: "MOTD",
							value: `\`\`\`txt\n${status.motd.clean}\n\`\`\``,
						},
						{
							name: "EULA Blocked?",
							value: status.eula_blocked ? "Yes" : "No",
						},
					]);
				}

				await int.editReply({
					embeds: [embed],
				});
			} catch (e) {
				console.log(e);

				await int.editReply({
					content: "Something went wrong...",
				});
			}

			break;
		}

		case "bedrock": {
			try {
				const status: McstatusIoBedrockServerResponse | null =
					await client.functions.getMCBedrockServerStatus(serverAddress);

				if (!status) return int.editReply({
					content: `Unable to find the server \`${serverAddress}\``
				})

				const embed = new EmbedBuilder()
					.setTitle(
						`${status.host}${status.port === 19132 ? "" : `:${status.port}`}`,
					)
					.setAuthor({
						name: "Minecraft Bedrock Server",
					})
					.setThumbnail(`https://api.mcstatus.io/v2/icon/${serverAddress}`)
					.addFields([
						{
							name: "Status",
							value: status.online ? "Online" : "Offline",
						},
					]);

				if (status.online) {
					embed.addFields([
						{
							name: "Version",
							value: status.version.name,
						},
						{
							name: "Players",
							value: `${status.players.online}/${status.players.max}`,
						},
						{
							name: "MOTD",
							value: `\`\`\`txt\n${status.motd.clean}\n\`\`\``,
						},
						{
							name: "Blocked by EULA",
							value: status.eula_blocked ? "Yes" : "No",
						},
						{
							name: "Default Gamemode",
							value: status.gamemode,
						},
					]);
				}

				await int.editReply({
					embeds: [embed],
				});
			} catch (e) {
				console.log(e);
				await int.editReply({
					content: "Something went wrong...",
				});
			}
			break;
		}
	}
};
