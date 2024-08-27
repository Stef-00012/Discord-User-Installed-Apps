const axios = require("axios")

module.exports = async (client, token, tokenType, id) => {
    try {
        await axios.post('https://discord.com/api/oauth2/token/revoke', new URLSearchParams({
            client_id: client.config.web.auth.clientId,
            client_secret: client.config.web.auth.clientSecret,
            token,
            token_type_hint: tokenType,
        }).toString(),
        {
            'Content-Type': 'application/x-www-form-urlencoded',
        })

        return true;
    } catch (error) {
        console.error(error?.response?.data || error)
        return false;
    }
}