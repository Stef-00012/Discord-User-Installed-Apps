module.exports = {
	token: "<BOT_TOKEN>",
	owners: ["<YOUR_ID>"],
	mongo: "<MONGO_URI>",
	zipline: {
		token: "<ZIPLINE_TOKEN>",
		url: "<ZIPLINE_URL>", // it should look like https://example.com
		chunkSize: 20, // in mb
		maxFileSize: 100, // in mb
	},
};
