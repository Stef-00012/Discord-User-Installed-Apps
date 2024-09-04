module.exports = {
	token: null, // Discord bot token
	owners: [], // IDs allowed to use owner commands and access the dashboard

	// Zipline Configs
	zipline: {
		token: null, // Zipline token
		url: null, // Zipline URL (it should look like https://example.com)
		chunkSize: null, // Zpline chunk size, for chunked uploads (in mb)
		maxFileSize: null, // Zpline max file size (in mb)
	},

	// DM "ninja_5000" on Discord for a token
	// Though there is no guarantee that you will receive one.
	naviac: {
		username: null, // Naviac auth username
		token: null, // Naviac auth token
	},

	// DM ".zach.o" on Discord for a token
	// Though there is no guarantee that you will receive one.
	gary: {
		apiKey: null
	},

	// Admin Web Dashboard
	web: {
		enabled: false, // Whetever have a web UI
		hostname: "localhost", // Hostname of the UI
		port: 3000, // Port of the UI
		secure: false, // Whetever use http or https
		keepPort: true, // Whetever keep the port in the messages
		
		// Discord OAuth2
		auth: {
			clientId: '', // Discord client ID
			clientSecret: '', // Discord client secret
			redirectURI: '', // Discord OAuth2 redirect URI
			scopes: '' // Discord OAuth2 scopes. "identify" scope is required for the bot to work
		},

		// JSON Web Token
		jwt: {
			secret: '' // JWT secret
		}
	}
};
