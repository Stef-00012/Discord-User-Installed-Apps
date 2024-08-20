const mongoose = require("mongoose");

const tags = mongoose.model(
	"tags",
	new mongoose.Schema({
		id: {
			type: String,
		},
		tags: [
			{
				name: {
					type: String,
				},
				data: {
					content: {
						type: String,
						nullable: true,
					},
					embeds: {
						type: Object,
						nullable: true,
					},
				},
			},
		],
	}),
);

const reminders = mongoose.model(
	"reminders",
	new mongoose.Schema({
		userId: {
			type: String
		},
		reminderId: {
			type: String
		},
		description: {
			type: String
		},
		date: {
			type: String
		}
	})
)

const ptero = mongoose.model(
	"ptero",
	new mongoose.Schema({
		id: {
			type: String
		},
		panelUrl: {
			type: String
		},
		apiKey: {
			type: String
		}
	})
)

function isConnected() {
	return mongoose.STATES[mongoose.connection.readyState] === "connected";
}

module.exports = {
	tags,
	reminders,
	ptero,
	isConnected,
};
