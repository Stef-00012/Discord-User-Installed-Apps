module.exports = {
	name: "ptero",
	requires: [],

	async execute(client, int) {
		const subcommandGroup = int.options.getSubcommandGroup();
		const subcommand = int.options.getSubcommand();

		let path = "";
		if (subcommandGroup) path += `${subcommandGroup}/`;
		path += subcommand;

		await require(`./ptero/${path}.js`)(client, int);
	},
};
