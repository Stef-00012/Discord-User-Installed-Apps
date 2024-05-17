const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
	name: "ask",
	requires: ['naviac'],

	async execute(client, int) {
		const question = int.options.getString("question");
		const ephemeral = int.options.getBoolean("personal");

		const embed = new EmbedBuilder();

		await int.deferReply({
			ephemeral,
		});
		
		try {
		    const res = await axios.put('https://avsac-api.onrender.com/generate-response', {
		        text: question
		    }, {
                auth: {
                    username: client.config.naviac.username,
                    password: client.config.naviac.token
                }
            })
            
            const response = res.data.response
            
            const embed = new EmbedBuilder()
                .setTitle("N.A.V.I.A.C.'s response")
                .setDescription(response)
                .setThumbnail('https://cdn.discordapp.com/avatars/975365560298795008/632ac9e6edf7517fa9378454c8600bdf.png?size=4096')

            await int.editReply({
                embeds: [embed]
            })
		} catch(e) {
		    int.editReply({
		        content: 'Something went wrong...'
		    })
		    
		    console.log(`\x1b[31mThe N.A.V.I.A.C. API request failed with status ${e.response.status} (${e.response.statusText})\x1b[0m`)
		}
	},
};