module.exports = {
	name: "tag",
	requires: ["mongo"],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		let userData = await client.mongo.tags.findOne({
			id: int.user.id,
		});
	
		if (!userData)
			userData = new client.mongo.tags({
				id: int.user.id,
				tags: [],
			});

		let matches = userData.tags.map(tag => ({
			name: tag.name,
			value: tag.name
		})).filter(tag => tag.name.startsWith(value))
		
		if (matches.length > 25) matches = matches.slice(0, 24)

			await int.respond(matches)
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./tag/${subcommand}.js`)(client, int);
	},
};
