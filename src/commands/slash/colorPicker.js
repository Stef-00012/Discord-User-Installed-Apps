const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas } = require("canvas");
const color = require("color");

module.exports = {
	name: "colorpicker",
	requires: [],
	async execute(client, int) {
		const hex = int.options.getString("hex").replace("#", "");
		const hexCodeRegex = /^([A-Fa-f0-9]{6})$/.test(hex);

		if (!hex || !hexCodeRegex) {
			await int.reply({
				content:
					"Please provide a valid hex color code. (e.g. `fecdac` or `#fecdac`)",
			});
			return;
		}

		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext("2d");

		ctx.beginPath();
		ctx.fillStyle = hex.startsWith("#") ? hex : `#${hex}`;
		ctx.fillRect(0, 0, 250, 250);
		ctx.closePath();

		const colorImage = canvas.toBuffer();

		const attachment = new AttachmentBuilder(colorImage, {
			name: `color_${hex.replace("#", "")}.jpg`,
		});

		const hexColor = color(hex.startsWith("#") ? hex : `#${hex}`);
		const rgb = hexColor.rgb().string();
		const hsl = hexColor.hsl().string();

		const embed = new EmbedBuilder()
			.setTitle("Color Picker")
			.setDescription(`Hex: \`#${hex}\`\nRGB: \`${rgb}\`\nHSL: \`${hsl}\``)
			.setImage(`attachment://color_${hex.replace("#", "")}.jpg`)
			.setColor(hex);

		await int.reply({
			embeds: [embed],
			files: [attachment],
		});
	},
};
