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

function isConnected() {
	return mongoose.STATES[mongoose.connection.readyState] === "connected";
}

module.exports = {
	tags,
	isConnected,
};
