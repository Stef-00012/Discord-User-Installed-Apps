const ubdict = require('@dmzoneill/urban-dictionary')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: "define",
	requires: [],

	async execute(client, int) {
		const term = int.options.getString("term");
		await int.deferReply()

        try {
    		const data = await ubdict.define(term)
    		
    		const definition = data[0]
    		
    		const embed = new EmbedBuilder()
    		    .setTitle(`Definition: ${term}`)
    		    .setURL(definition.permalink)
    		    .setTimestamp(new Date(definition.written_on))
    		    .setFooter({
    		        text: `By ${definition.author} | ${definition.defid}`
    		    })
    		    .setFields([
    		        {
    		            name: 'Definition:',
    		            value: definition.definition
    		        },
    		        {
    		            name: 'Example:',
    		            value: definition.example
    		        },
    		        {
    		            name: 'Votes',
    		            value: `${definition.thumbs_up} like${definition.thumbs_up > 1 ? 's' : ''} :+1: | ${definition.thumbs_down} like${definition.thumbs_down > 1 ? 's' : ''} :-1:`
    		        }
    		    ])
    
    		int.editReply({
    			embeds: [embed]
    		});
        } catch(e) {
            int.editReply({
                content: `No results found for "${term}"`
            })
        }
	},
};
