module.exports = {
	name: "gary",
	requires: ["gary"],

	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		await require(`./gary/${subcommand}.js`)(client, int);
	},
};
