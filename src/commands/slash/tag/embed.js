const {
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");
const { and, eq } = require("drizzle-orm");

module.exports = async (client, int) => {
	await int.deferReply({
		ephemeral: true,
	});

	const tagName = int.options.getString("name");
	const removeEmbedIndex = int.options.getInteger("remove-index");

	const tagsSchema = client.dbSchema.tags

	const tag = await client.db.query.tags.findFirst({
		where: and(
			eq(tagsSchema.id, int.user.id),
			eq(tagsSchema.name, tagName)
		)
	})

	if (tag) tag.data = JSON.parse(tag.data)

	const tagData = {
		content: tag?.data?.content || null,
		embeds: tag?.data?.embeds || null,
	};

	if (removeEmbedIndex && !tag)
			return int.editReply({
				content: "This tag doesn't exist"
			})

	if (removeEmbedIndex && (!tagData?.embeds || tagData?.embeds?.length <= 0))
		return inArray.editReply({
			content: "This message already has no embeds"
		})

	if (!removeEmbedIndex && tagData?.embeds?.length >= 25)
		return int.editReply({
			content: "You reached the embed limit for this tag",
		});

	if (removeEmbedIndex && (removeEmbedIndex < 1 || removeEmbedIndex > 25))
		return int.editReply({
			content: "Embed index must be between 1 and 25",
		});

	if (removeEmbedIndex && tagData?.embeds?.length < removeEmbedIndex)
		return int.editReply({
			content: `No embed exists at the index ${removeEmbedIndex}`
		});

	if (removeEmbedIndex) {
		tagData.embeds = tagData.embeds.filter(
			(embed, index) => index !== removeEmbedIndex - 1,
		);

		if (
			(!tagData?.content || tagData?.content?.length <= 0) &&
			(!tagData?.embeds || tagData?.embeds <= 0)
		)
			return int.editReply({
				content: "A tag can not be empty"
			});

		await client.db
			.update(tagsSchema)
			.set({
				data: JSON.stringify(tagData)
			})
			.where(
				and(
					eq(tagsSchema.id, int.user.id),
					eq(tagsSchema.name, tagName)
				)
			)

		return int.editReply({
			content: `Successfully removed the embed at the index ${removeEmbedIndex}`,
		});
	}

	const embedTitle = int.options.getString("title") ?? null;
	const embedDescription = int.options.getString("description") ?? null;
	const embedURL = int.options.getString("url") ?? null;
	const embedTimestamp = int.options.getBoolean("timestamp") ?? false;
	const embedColor = int.options.getString("color") ?? null;
	const embedFooterText = int.options.getString("footer-text") ?? null;
	const embedFooterIcon = int.options.getString("footer-icon") ?? null;
	const embedImage = int.options.getString("image") ?? null;
	const embedThumbnail = int.options.getString("thumbnail") ?? null;
	const embedAuthorName = int.options.getString("author-name") ?? null;
	const embedAuthorIcon = int.options.getString("author-icon") ?? null;
	const embedFields = int.options.getBoolean("fields") ?? false;
	let embedJSON = int.options.getString("json") ?? "{}";

	try {
		embedJSON = JSON.parse(embedJSON);
	} catch (e) {
		return int.editReply({
			content: "Invalid JSON",
			ephemeral: true,
		});
	}

	let embed = new EmbedBuilder();

	if (embedTitle) embed.setTitle(embedTitle);
	if (embedDescription) embed.setDescription(embedDescription);
	if (embedURL) embed.setURL(embedURL);
	if (embedTimestamp) embed.setTimestamp();
	if (embedColor) embed.setColor(embedColor);
	if (embedFooterText || (embedFooterText && embedFooterIcon))
		embed.setFooter({
			text: embedFooterText,
			iconURL: embedFooterIcon,
		});
	if (embedImage) embed.setImage(embedImage);
	if (embedThumbnail) embed.setThumbnail(embedThumbnail);
	if (embedAuthorName || (embedAuthorName && embedAuthorIcon))
		embed.setAuthor({
			name: embedAuthorName,
			iconURL: embedAuthorIcon,
		});

	if (!embedFields) {
		embed = EmbedBuilder.from({
			...embed.toJSON(),
			...embedJSON,
		});

		try {
			int.editReply({
				embeds: [embed],
			});

			if (!tagData.embeds) tagData.embeds = [];

			tagData.embeds.push(embed.data);

			if (tag) {
				return await client.db
					.update(tagsSchema)
					.set({
						data: JSON.stringify(tagData)
					})
					.where(
						and(
							eq(tagsSchema.id, int.user.id),
							eq(tagsSchema.name, tagName)
						)
					)
			}
			
			return await client.db
				.insert(tagsSchema)
				.values({
					name: tagName,
					id: int.user.id,
					data: JSON.stringify(tagData)
				})
		} catch (e) {
			console.log(e);

			return int.editReply({
				content: "I'm unable to send this embed, check the console",
				ephemeral: true,
			});
		}
	}

	const fields = [];

	const addFieldButton = new ButtonBuilder()
		.setLabel("Add Field")
		.setStyle(ButtonStyle.Success)
		.setCustomId("addField");

	const clearFieldsButton = new ButtonBuilder()
		.setLabel("Clear Fields")
		.setStyle(ButtonStyle.Danger)
		.setCustomId("clearFields");

	const saveButton = new ButtonBuilder()
		.setLabel("Save")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("save");

	const fieldButtonsRow = new ActionRowBuilder().addComponents([
		addFieldButton,
		clearFieldsButton,
		saveButton,
	]);

	const msg = await int.editReply({
		components: [fieldButtonsRow],
	});

	const buttonCollector = msg.createMessageComponentCollector({
		filter: (inter) =>
			["addField", "clearFields", "save"].includes(inter.customId),
		time: 60e3 * 10,
	});

	buttonCollector.on("collect", async (inter) => {
		if (inter.customId === "save") {
			buttonCollector.stop("saved");

			embed.setFields(fields);

			embed = EmbedBuilder.from({
				...embed.toJSON(),
				...embedJSON,
			});

			try {
				inter.reply({
					content: "Sucessfully added this embed to the tag:",
					embeds: [embed],
					ephemeral: true,
				});

				if (!tagData.embeds) tagData.embeds = [];

				tagData.embeds.push(embed.data);

				if (tag) {
					return await client.db
						.update(tagsSchema)
						.set({
							data: JSON.stringify(tagData)
						})
						.where(
							and(
								eq(tagsSchema.id, int.user.id),
								eq(tagsSchema.name, tagName)
							)
						)
				}
				
				return await client.db
					.insert(tagsSchema)
					.values({
						name: tagName,
						id: int.user.id,
						data: JSON.stringify(tagData)
					})
			} catch (e) {
				console.log(e);

				return int.editReply({
					content:
						"I'm unable to send this embed or to save the database, check the console",
					ephemeral: true,
				});
			}
		}

		if (inter.customId === "clearFields") embed.setFields([]);

		if (inter.customId === "addField") {
			const fieldModal = new ModalBuilder()
				.setCustomId("addField")
				.setTitle("Add a field");

			const fieldName = new TextInputBuilder()
				.setCustomId("name")
				.setLabel("Field Name")
				.setMaxLength(256)
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph);

			const fieldValue = new TextInputBuilder()
				.setCustomId("value")
				.setLabel("Field Value")
				.setMaxLength(1024)
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph);

			const fieldNameRow = new ActionRowBuilder().addComponents([fieldName]);

			const fieldValueRow = new ActionRowBuilder().addComponents([fieldValue]);

			fieldModal.addComponents([fieldNameRow, fieldValueRow]);

			await inter.showModal(fieldModal);

			await inter
				.awaitModalSubmit({
					filter: (interaction) => interaction.customId === "addField",
					time: 60e3 * 5,
				})
				.then(async (interaction) => {
					const fieldName = interaction.fields.getTextInputValue("name");
					const fieldValue = interaction.fields.getTextInputValue("value");

					fields.push({
						name: fieldName,
						value: fieldValue,
					});

					if (fields.length === 25) {
						const disabledAddRow = new ActionRowBuilder().addComponents([
							addFieldButton.setDisabled(true),
							clearFieldsButton,
							saveButton,
						]);

						return await interaction.update({
							content: `Successfully added the field (${fields.length}/25)`,
							components: [disabledAddRow],
						});
					}

					return await interaction.update({
						content: `Successfully added the field (${fields.length}/25)`,
						ephemeral: true,
					});
				});
		}
	});
};
