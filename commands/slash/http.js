module.exports = {
	name: "http",
	requires: [],

	async execute(client, int) {
		const urls = {
			cat: "https://http.cat/{status}",
			dog: "https://httpstatusdogs.com/img/{status}.jpg",
			goat: "https://httpgoats.com/{status}.jpg"
		};

		const type = int.options.getString("type");
		const status = int.options.getInteger("status");

		int.reply({
			content: urls[type].replace("{status}", status),
		});
	},
};
