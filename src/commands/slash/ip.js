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
			{
				name: "Country",
				value: ipData.country,
			},
			{
				name: "Country Code",
				value: ipData.countryCode,
			},
			{
				name: "Region",
				value: ipData.region,
			},
			{
				name: "Region Name",
				value: ipData.regionName,
			},
			{
				name: "City",
				value: ipData.city,
			},
			{
				name: "ZIP",
				value: ipData.zip,
			},
			{
				name: "Latitute",
				value: `${ipData.lat}`,
			},
			{
				name: "Longitude",
				value: `${ipData.lon}`,
			},
			{
				name: "Timezone",
				value: ipData.timezone,
			},
			{
				name: "ISP",
				value: ipData.isp,
			},
			{
				name: "ORG",
				value: ipData.org,
			},
			{
				name: "AS",
				value: ipData.as,
			},
		];
		
		embed.setFields(fields)
		
		console.log(fields)

		int.editReply({
		    embeds: [embed]
		})
	},
};
