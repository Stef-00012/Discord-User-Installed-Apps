import axios from "axios"
import type { Client } from "../../structures/DiscordClient";
import type { RESTPostOAuth2RefreshTokenResult } from "discord.js";
import type { DatabaseTokenData } from "../../types/discord";

export default async function (client: Client, token: string): Promise<DatabaseTokenData | null> {
    if (!client.config.web || !client.config.web.enabled) return null;

    try {
        const newTokenData: RESTPostOAuth2RefreshTokenResult = (
            await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: client.config.web.auth.clientId,
                client_secret: client.config.web.auth.clientSecret,
                grant_type: 'refresh_token',
                redirect_uri: client.config.web.auth.redirectURI,
                scope: client.config.web.auth.scopes,
                refresh_token: token
            }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                })
        ).data

        return {
            accessToken: newTokenData.access_token,
            refreshToken: newTokenData.refresh_token,
            expiresAt: new Date((Math.floor(new Date().getTime() / 1000) + newTokenData.expires_in) * 1000).toISOString(),
            scopes: newTokenData.scope
        } as DatabaseTokenData;
    } catch (e) {
        return null;
    }
}