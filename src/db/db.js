const { drizzle } = require("drizzle-orm/better-sqlite3")
const Database = require('better-sqlite3');
const schema = require("./schema.js")

module.exports = () => {
    const client = new Database('./data/data.db');

    return drizzle(client, {
        schema
    })
}