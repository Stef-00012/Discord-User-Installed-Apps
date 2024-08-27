module.exports = {
	name: "status",
	requires: [],

	async autocomplete(client, int) {
		const value = int.options.getFocused();
		const commands = client.commands;

		let matches = commands
			.map((cmd) => ({
				name: cmd.name,
				value: cmd.name,
			}))
			.filter((cmd) => cmd.name.toLowerCase().startsWith(value.toLowerCase()));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./status/${subcommand}.js`)(client, int);
	},
};
