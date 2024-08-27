const axios = require("axios");

module.exports = {
	name: "ping",
	requires: [],

	async execute(client, int) {
		int.reply({
            content: `My ping is ${client.ws.ping}ms`
        })
	},
};
