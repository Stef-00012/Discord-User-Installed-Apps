const axios = require("axios")
const jwt = require('jsonwebtoken')

module.exports = async (client, code) => {
    if (!code) return null;

    try {
        const tokenData = (
            await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: client.config.web.auth.clientId,
                client_secret: client.config.web.auth.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: client.config.web.auth.redirectURI,
                scope: client.config.web.auth.scopes
            }).toString(),
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        ).data

        const userData = (
            await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `${tokenData.token_type} ${tokenData.access_token}`
                }
            })
        ).data

        let userTokenData = await client.mongo.tokens.findOne({
            id: userData.id
        })

        if (!userTokenData) userTokenData = new client.mongo.tokens({
            id: userData.id
        })

        userTokenData.accessToken = tokenData.access_token
        userTokenData.refreshToken = tokenData.refresh_token
        userTokenData.expiresAt = new Date((Math.floor(new Date().getTime() / 1000) + tokenData.expires_in) * 1000).toISOString()
        userTokenData.scopes = tokenData.scopes

        await userTokenData.save()

        return jwt.sign({
            userId: userData.id
        }, client.config.web.jwt.secret)
    } catch (error) {
        console.error(error?.response?.data || error)
        return null;
    }
}