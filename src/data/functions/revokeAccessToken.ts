import axios from "axios"
import type { Client } from "../../structures/DiscordClient";

export default async function (client: Client, token: string, tokenType: string, id: string): Promise<boolean | null> {
    if (!client.config.web || !client.config.web.enabled) return null;

    try {
        await axios.post('https://discord.com/api/oauth2/token/revoke', new URLSearchParams({
            client_id: client.config.web.auth.clientId,
            client_secret: client.config.web.auth.clientSecret,
            token,
            token_type_hint: tokenType,
        }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })

        return true;
    } catch (error) {
        console.error(error?.response?.data || error)
        return false;
    }
}