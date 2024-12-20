import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import schema from "./schema";

const client = new Database("./data/data.db");

export default drizzle(client, {
	schema,
});
