const axios = require("axios")

module.exports = async (client, token) => {
    try {
        const newTokenData = (
            await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: client.config.web.auth.clientId,
                client_secret: client.config.web.auth.clientSecret,
                grant_type: 'refresh_token',
                redirect_uri: client.config.web.auth.redirectURI,
                scope: client.config.web.auth.scopes,
                refresh_token: token
            }).toString(),
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        ).data

        return {
            accessToken: newTokenData.access_token,
            refreshToken: newTokenData.refresh_token,
            expiresAt: new Date((Math.floor(new Date().getTime() / 1000) + newTokenData.expires_in) * 1000).toISOString(),
            scopes: newTokenData.scope
        }
    } catch(e) {
        return null;
    }
}