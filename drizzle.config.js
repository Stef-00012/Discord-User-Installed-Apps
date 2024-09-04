const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.js",
	out: "./drizzle",
	dbCredentials: {
		url: "data.db"
	},
});
