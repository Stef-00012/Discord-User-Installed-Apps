const axios = require("axios");
const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require("discord.js");

module.exports = {
	name: "Save as Tag",
	requires: "mongo",

	async execute(client, int) {
		if (
			int.targetMessage?.content?.length <= 0 &&
			int.targetMessage?.embeds?.length <= 0
		)
			return int.reply({
				content: "This message has no content",
				ephemeral: true,
			});

		let userData = await client.mongo.tags.findOne({
			id: int.user.id,
		});

		if (!userData)
			userData = new client.mongo.tags({
				id: int.user.id,
				tags: [],
			});

		if (int.targetMessage?.content?.length > 0) {
			const modal = new ModalBuilder()
				.setTitle("Create a Tag")
				.setCustomId("createTag");

			const nameOption = new TextInputBuilder()
				.setCustomId("name")
				.setLabel("Name")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder(int.targetMessage.content.split(" ")[0].substr(0, 25));

			const contentOption = new TextInputBuilder()
				.setCustomId("content")
				.setLabel("Content")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph)
				.setValue(int.targetMessage.content.substr(0, 2048));

			const nameRow = new ActionRowBuilder().addComponents([nameOption]);

			const contentRow = new ActionRowBuilder().addComponents([contentOption]);

			modal.addComponents([nameRow, contentRow]);

			await int.showModal(modal);

			int
				.awaitModalSubmit({
					filter: (interaction) =>
						interaction.customId === "createTag" &&
						interaction.user.id === int.user.id,
					time: 60e3,
				})
				.then(async (interaction) => {
					const tagName = interaction.fields.getTextInputValue("name");
					const tagContent = interaction.fields.getTextInputValue("content");

					const tags = [...userData.tags];

					const existingTag = tags.find((tag) => tag.name === tagName);

					if (existingTag) {
						const tagIndex = tags.findIndex((tag) => tag.name === tagName);

						tags[tagIndex].data = {
							content: tagContent,
							embeds:
								int.targetMessage?.embeds?.map((embed) => embed.data) || null,
						};

						interaction.reply({
							content: `Successfully replaced the tag \`${tagName}\` with the content:\n>>> ${
								tagContent.length >= 2000 - 58 - tagName.length
									? `${tagContent.substr(0, 2000 - 58 - tagName.length)}...`
									: tagContent
							}`,
							ephemeral: true,
						});
					} else {
						tags.push({
							name: tagName,
							data: {
								content: tagContent,
								embeds: int.targetMessage?.embeds || null,
							},
						});

						interaction.reply({
							content: `Successfully set the tag \`${tagName}\` with the content:\n>>> ${
								tagContent.length > 2000 - 58 - tagName.length
									? `${tagContent.substr(0, 2000 - 58 - tagName.length)}...`
									: tagContent
							}`,
							ephemeral: true,
						});
					}

					userData.tags = tags;

					await userData.save();
				});
		} else {
			const modal = new ModalBuilder()
				.setTitle("Create a Tag")
				.setCustomId("createTag");

			const nameOption = new TextInputBuilder()
				.setCustomId("name")
				.setLabel("Name")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder(int.targetMessage.content.split(" ")[0].substr(0, 25));

			const nameRow = new ActionRowBuilder().addComponents([nameOption]);

			modal.addComponents([nameRow]);

			await int.showModal(modal);

			int
				.awaitModalSubmit({
					filter: (interaction) =>
						interaction.customId === "createTag" &&
						interaction.user.id === int.user.id,
					time: 60e3,
				})
				.then(async (interaction) => {
					const tagName = interaction.fields.getTextInputValue("name");

					const tags = [...userData.tags];

					const existingTag = tags.find((tag) => tag.name === tagName);

					if (existingTag) {
						const tagIndex = tags.findIndex((tag) => tag.name === tagName);

						tags[tagIndex].data = {
							content: int.targetMessage?.content || null,
							embeds:
								int.targetMessage?.embeds?.map((embed) => embed.data) || null,
						};

						interaction.reply({
							content: `Successfully replaced the tag \`${tagName}\` with the data of this message`,
							ephemeral: true,
						});
					} else {
						tags.push({
							name: tagName,
							data: {
								content: int.targetMessage?.content || null,
								embeds: int.targetMessage?.embeds || null,
							},
						});

						interaction.reply({
							content: `Successfully set the tag \`${tagName}\` with the data of this mesaage`,
							ephemeral: true,
						});
					}

					userData.tags = tags;

					await userData.save();
				});
		}
	},
};
