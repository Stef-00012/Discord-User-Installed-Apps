module.exports = {
	name: "ptero",
	requires: ["mongo"],

	async execute(client, int) {
        const subcommandGroup = int.options.getSubcommandGroup()
		const subcommand = int.options.getSubcommand();

        let path = ''
        if (subcommandGroup) path += `${subcommandGroup}/`
        path += subcommand

		require(`./ptero/${path}.js`)(client, int);
	},
};
