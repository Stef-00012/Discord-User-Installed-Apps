const ubdict = require('@dmzoneill/urban-dictionary')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: "define",
	requires: [],

	async execute(client, int) {
		const term = int.options.getString("term");

		const data = await ubdict.define(term)
		
		const definition = data[0]
		
		const embed = new EmbedBuilder()
		    .setTitle(`Definition: ${term}`)
		    .setURL(definition.permalink)
		    .setTimestamp(new Date(definition.written_on))
		    .setFooter(`By ${definition.author} | ${definition.thumbs_up} :+1: | ${definition.defid}`)
		    .setFields([
		        {
		            name: 'Definition:',
		            value: definition.definition
		        },
		        {
		            name: 'Example:',
		            value: definition.example
		        }
		    ])

		int.reply({
			embeds: [embed]
		});
	},
};
