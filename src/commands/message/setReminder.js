const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder
} = require("discord.js");
const ms = require("enhanced-ms");
const { randomUUID } = require("node:crypto");

module.exports = {
	name: "Set as Reminder",
	requires: [],

	async execute(client, int) {
		if (!int.targetMessage?.content || int.targetMessage?.content?.length <= 0)
			return int.reply({
				content: "This message has no content",
				ephemeral: true,
			});

		const modal = new ModalBuilder()
			.setTitle("Set as Reminder")
			.setCustomId("setAsReminder");

		const timeInput = new TextInputBuilder()
			.setLabel("Time")
			.setPlaceholder("1d, 20m, 30s etc.")
			.setCustomId("time")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setMinLength(2);

		const reminderInput = new TextInputBuilder()
			.setLabel("Reminder")
			.setCustomId("reminder")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setMaxLength(900)
			.setMinLength(1)
			.setValue(int.targetMessage.content.substr(0, 900));

		const timeRow = new ActionRowBuilder().addComponents([timeInput]);

		const reminderRow = new ActionRowBuilder().addComponents([reminderInput]);

		modal.addComponents([timeRow, reminderRow]);

		await int.showModal(modal);

		int
			.awaitModalSubmit({
				filter: (interaction) =>
					interaction.customId === "setAsReminder" &&
					interaction.user.id === int.user.id,
				time: 60e3,
			})
			.then(async (inter) => {
				const time = inter.fields.getTextInputValue("time");
				const reminder = inter.fields.getTextInputValue("reminder");

				const msTime = ms(time);

                if (!msTime || msTime < 30000)
                    return inter.reply({
                        content: "Invalid time",
                        ephemeral: true,
                    });

                let reminderId = randomUUID().slice(0, 8);

                await inter.deferReply({
                    ephemeral: true,
                });

                let existsReminderWithId = await checkId(client, inter, reminderId);

                while (existsReminderWithId) {
                    reminderId = randomUUID().slice(0, 8);

                    existsReminderWithId = await checkId(client, inter, reminderId);
                }

                const newReminder = await new client.mongo.reminders({
                    userId: inter.user.id,
                    reminderId,
                    description: reminder,
                    date: new Date(Date.now() + msTime).toISOString(),
                });

                await newReminder.save()

                return inter.editReply({
                    content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reminder}`,
                });
			});
	},
};

async function checkId(client, int, reminderId) {
	const existingReminderWithid = await client.mongo.reminders.findOne({
		userId: int.user.id,
		reminderId,
	});

	if (existingReminderWithid) return true;

	return false;
}
