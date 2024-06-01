module.exports = {
	token: null, // string
	owners: [], // array<string> (user ID)
	mongo: null, // string
	zipline: {
		token: null, // string
		url: null, // string (it should look like https://example.com)
		chunkSize: null, // number (in mb)
		maxFileSize: null, // number (in mb)
	},
	autocomplete: {
		tag: true, // whether tag command should have autocomplete
	},
	naviac: {
		username: null, // string
		token: null, // string
	},
};
