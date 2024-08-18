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
	tagPreview: {
		enabled: false, // whetever have a web preview of conflicting tags, having this off will automatically overwrite without showing conflicts
		hostname: "localhost", // hostname of the preview
		port: 3000, // port of the preview
		secure: false, // whetever use http or https
		path: '/', // root path of the tag preview
		keepPort: true // whetever keep the port in the requests and the conflicts message
	}
};
