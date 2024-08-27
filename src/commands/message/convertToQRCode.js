const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	AttachmentBuilder,
} = require("discord.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

module.exports = {
	name: "Convert to QR Code",
	requires: [],

	async execute(client, int) {
		if (!int.targetMessage?.content || int.targetMessage?.content?.length <= 0)
			return int.reply({
				content: "This message has no content",
				ephemeral: true,
			});

		const modal = new ModalBuilder()
			.setTitle("Conert to QR Code")
			.setCustomId("convertToQRCode");

		const typeInput = new TextInputBuilder()
			.setLabel("Type")
			.setPlaceholder("text or image, default = text")
			.setCustomId("type")
			.setStyle(TextInputStyle.Short)
			.setRequired(false);

		const textInput = new TextInputBuilder()
			.setLabel("Text")
			.setCustomId("text")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setMaxLength(900)
			.setMinLength(1)
			.setValue(int.targetMessage.content.substr(0, 900));

		const typeRow = new ActionRowBuilder().addComponents([typeInput]);

		const textRow = new ActionRowBuilder().addComponents([textInput]);

		modal.addComponents([textRow, typeRow]);

		await int.showModal(modal);

		int
			.awaitModalSubmit({
				filter: (interaction) =>
					interaction.customId === "convertToQRCode" &&
					interaction.user.id === int.user.id,
				time: 60e3,
			})
			.then(async (inter) => {
				let type = inter.fields.getTextInputValue("type");
				const text = inter.fields.getTextInputValue("text");

				if (!["text", "image"].includes(type?.toLowerCase())) type = "text";

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

						inter.reply({
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
							return inter.reply({
								content: "The API did not return any QR code",
								ephemeral: true,
							});

						const attachment = new AttachmentBuilder().setFile(req.data);

						inter.reply({
							files: [attachment],
						});

						break;
					}
				}
			});
	},
};
