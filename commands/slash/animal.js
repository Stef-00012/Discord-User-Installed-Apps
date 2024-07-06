const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: "animal",
	requires: [],

	async autocomplete(client, int) {
		const value = int.options.getFocused();

		

		let matches = records.filter((tag) => tag.name.startsWith(value));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},

	async execute(client, int) {
		let type = int.options.getString("type");
        let pic;

        const types = ['cat', 'dog', 'fox', 'duck']

        if (!type) type = types[Math.floor(Math.random() * types.length)]

        await int.deferReply()
		
        switch(type) {
            case 'fox': {
                const data = await axios.get('https://randomfox.ca/floof')

                pic = data.data.image

                break;
            }

            case 'duck': {
                const data = await axios.get('https://random-d.uk/api/v2/random')

                pic = data.data.url

                break;
            }

            case 'cat': {
                const data = await axios.get('https://api.thecatapi.com/v1/images/search')

                pic = data.data[0].url

                break;
            }

            case 'dog': {
                const data = await axios.get('https://dog.ceo/api/breeds/image/random')

                pic = data.data.message
            }
        }

        const embed = new EmbedBuilder()
            .setImage(pic)
            .setTitle(`Random ${type}`)

        int.editReply({
            embeds: [embed]
        })
	},
};
