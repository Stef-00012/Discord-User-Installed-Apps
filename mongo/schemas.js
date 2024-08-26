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

const tokens = mongoose.model(
	"tokens",
	new mongoose.Schema({
		id: {
			type: String
		},
		accessToken: {
			type: String
		},
		refreshToken: {
			type: String
		},
		expiresAt: {
			type: String
		},
		scopes: {
			type: String
		}
	})
)

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

const analytics = mongoose.model(
	"analytics",
	new mongoose.Schema({
		commandName: {
			type: String
		},
		uses: {
			type: Number,
			default: 0
		}
	})
)

function isConnected() {
	return mongoose.STATES[mongoose.connection.readyState] === "connected";
}

module.exports = {
	tags,
	ptero,
	tokens,
	reminders,
	analytics,
	isConnected,
};
