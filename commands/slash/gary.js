module.exports = {
	name: "gary",
	requires: ["gary"],

	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./gary/${subcommand}.js`)(client, int);
	},
};
