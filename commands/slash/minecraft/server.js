const {
	EmbedBuilder
} = require("discord.js");

module.exports = async (client, int) => {
	const serverVersion = int.options.getString("version");
	const serverAddress = int.options.getString("address");

	await int.deferReply();

	switch (serverVersion) {
		case "java": {
			try {
				const status =
					await client.functions.getMCJavaServerStatus(serverAddress);


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
							value: status.version.name_clean,
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

				int.editReply({
					embeds: [embed],
				});
			} catch (e) {
				console.log(e);
				int.editReply({
					content: "Something went wrong...",
					ephemeral: true,
				});
			}

			break;
		}

		case "bedrock": {
			try {
				const status =
					await client.functions.getMCBedrockServerStatus(serverAddress);

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

				int.editReply({
					embeds: [embed],
				});
			} catch (e) {
				console.log(e);
				int.editReply({
					content: "Something went wrong...",
					ephemeral: true,
				});
			}
			break;
		}
	}
};
