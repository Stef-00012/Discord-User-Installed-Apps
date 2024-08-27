const jwt = require('jsonwebtoken')

module.exports = async (client, JWT) => {
    if (!JWT) return null;
    
    let decodedJWT;

    try {
        decodedJWT = jwt.verify(JWT, client.config.web.jwt.secret)
    } catch(e) {
        return null;
    }
    
    const userData = await client.mongo.tokens.findOne({
        id: decodedJWT.userId
    })
    
    if (!userData) return null;
    
    if (new Date().getTime() > new Date(userData?.expiresAt).getTime()) {
        const refreshedTokenData = await client.functions.refreshToken(client, userData.refreshToken)
        
        if (!refreshedTokenData) return null;
        
        for (const key in refreshedTokenData) {
            userData[key] = refreshedTokenData[key]
        }

        await userData.save()

        return refreshedTokenData;
    }
    
    if (userData) return userData;
}