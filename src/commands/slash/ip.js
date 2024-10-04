const axios = require('axios')
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "ip",
	requires: [],

	async execute(client, int) {
		const ip = int.options.getString("ip");

		await int.deferReply();

		const res = await axios.get(`https://we-are-jammin.xyz/json/${ip}`)
		
		const ipData = res.data
		
		if (!ipData.status === "success") return int.editReply({
		    content: "The IP address query has failed"
		});

		const embed = new EmbedBuilder();

		const fields = [
    { name: "Country", value: ipData.country, inline: true },
    { name: "Country Code", value: ipData.countryCode, inline: true },
    { name: "Region", value: ipData.region }, // Not inline, so it appears on a new line
    { name: "Region Name", value: ipData.regionName }, // Not inline, so it appears on a new line
    { name: "City", value: ipData.city, inline: true },
    { name: "ZIP", value: ipData.zip, inline: true }, // Inline with City
    { name: "Latitude", value: `${ipData.lat}`, inline: true },
    { name: "Longitude", value: `${ipData.lon}`, inline: true }, // Inline with Latitude
    { name: "Timezone", value: ipData.timezone }, // Not inline, so it appears on a new line
    { name: "ISP", value: ipData.isp, inline: true },
    { name: "ORG", value: ipData.org, inline: true },
    { name: "AS", value: ipData.as } // Not inline, so it appears on a new line
];

embed.set
		
		console.log(fields)

		int.editReply({
		    embeds: [embed]
		})
	},
};
