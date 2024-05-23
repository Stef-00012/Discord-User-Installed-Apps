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
                .addFields([{
                    name: 'Prompt',
                    value: `> ${question}`
                }])

            const regex = /\[Image generated with the help of Pollinations AI's services\]\((.*?)\)/;
            
            const match = response.match(regex)
            
            if (match) {
                embed.setImage(match[1])
                    .setFooter({
                        text: 'Image generated with the help of Pollinations AI\'s services',
                        icon: 'https://cdn.discordapp.com/avatars/975365560298795008/632ac9e6edf7517fa9378454c8600bdf.png?size=4096'
                    })
                    if (response.replace(regex, '').length > 0) embed.addFields([{
                        name: 'Response',
                        value: response.replace(regex, '')
                    }])
            } else {
                embed.addFields([{
                    name: 'Response',
                    value: response
                }])
                    .setThumbnail('https://cdn.discordapp.com/avatars/975365560298795008/632ac9e6edf7517fa9378454c8600bdf.png?size=4096')
            }
            
            await int.editReply({
                embeds: [embed]
            })
		} catch(e) {
		    if (e?.response?.status) return int.editReply({
		        content: `The N.A.V.I.A.C. API request failed with status ${e.response.status} (${e.response.statusText})`
		    })
		    
		    console.log(e)
		    
		    int.editReply({
		        content: 'Something went wrong...'
		    })
		}
	},
};