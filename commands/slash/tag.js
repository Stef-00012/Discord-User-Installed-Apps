module.exports = {
	name: "tag",
	requires: ["mongo"],

	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./tag/${subcommand}.js`)(client, int);
	},
};
