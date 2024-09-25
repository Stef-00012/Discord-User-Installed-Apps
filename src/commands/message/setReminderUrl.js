const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder
} = require("discord.js");
const { eq, and } = require("drizzle-orm");
const ms = require("enhanced-ms");
const { randomUUID } = require("node:crypto");

module.exports = {
	name: "Set as Reminder (URL)",
	requires: [],

	async execute(client, int) {
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

		const timeRow = new ActionRowBuilder().addComponents([timeInput]);

		modal.addComponents([timeRow]);

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
                const reminder = int.targetMessage.url

                console.log(reminder)

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

				const remindersSchema = client.dbSchema.reminders

				await client.db
					.insert(remindersSchema)
					.values({
						userId: inter.user.id,
						reminderId,
						description: reminder,
						date: new Date(Date.now() + msTime).toISOString(),
					})

                return inter.editReply({
                    content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reminder}`,
                });
			});
	},
};

async function checkId(client, int, reminderId) {
	const remindersSchema = client.dbSchema.reminders

	const existingReminderWithid = await client.db.query.reminders.findFirst({
		where: and(
			eq(remindersSchema.reminderId, reminderId),
			eq(remindersSchema.userId, int.user.id)
		)
	})

	if (existingReminderWithid) return true;

	return false;
}
