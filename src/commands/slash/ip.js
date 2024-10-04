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
    { name: "Region", value: ipData.region, inline: true },
    { name: "Region Name", value: ipData.regionName },
    { name: "City", value: ipData.city, inline: true },
    { name: "ZIP", value: ipData.zip },
    { name: "Latitude", value: `${ipData.lat}`, inline: true },
    { name: "Longitude", value: `${ipData.lon}` },
    { name: "Timezone", value: ipData.timezone },
    { name: "ISP", value: ipData.isp, inline: true },
    { name: "ORG", value: ipData.org, inline: true },
    { name: "AS", value: ipData.as }
];

embed.setFields(fields);
		
		console.log(fields)

		int.editReply({
		    embeds: [embed]
		})
	},
};
