const { eq } = require("drizzle-orm");

module.exports = {
	name: "tag",
	requires: [],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		const tagsSchema = client.dbSchema.tags

		const userTags = await client.db.query.tags.findMany({
			where: eq(tagsSchema.id, int.user.id)
		}) || []

		if (userTags?.length <= 0) return int.respond([]);

		let matches = userTags
			.map((tag) => ({
				name: tag.name,
				value: tag.name,
			}))
			.filter((tag) => tag.name.startsWith(value));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client, int) {
		const subcommand = int.options.getSubcommand();

		require(`./tag/${subcommand}.js`)(client, int);
	},
};
