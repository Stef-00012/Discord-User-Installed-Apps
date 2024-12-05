import {
    sqliteTable,
    integer,
    text,
    primaryKey
} from "drizzle-orm/sqlite-core";

const tags = sqliteTable("tags", {
    id: text("id").notNull(),
    name: text("name").notNull(),
    data: text("data", {
        mode: "json"
    }).notNull()
}, (table) => {
    return {
        pk: primaryKey({
            columns: [
                table.id,
                table.name
            ]
        })
    }
});

const ptero = sqliteTable("ptero", {
    id: text("id").notNull().primaryKey(),
    panelUrl: text("panel_url").notNull(),
    apiKey: text("api_key").notNull()
})

const tokens = sqliteTable("tokens", {
    id: text("id").notNull().primaryKey(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: text("expires_at").notNull(),
    scopes: text("scopes")
})

const reminders = sqliteTable("reminders", {
    userId: text("user_id").notNull(),
    reminderId: text("reminder_id").notNull(),
    description: text("description").notNull(),
    date: text("date").notNull()
}, (table) => {
    return {
        pk: primaryKey({
            columns: [
                table.userId,
                table.reminderId
            ]
        })
    }
})

const analytics = sqliteTable("analytics", {
    commandName: text("command_name").notNull().primaryKey(),
    uses: integer("uses").notNull().default(0)
})

export default {
    tags,
    ptero,
    tokens,
    reminders,
    analytics
};
