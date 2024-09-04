const { eq } = require('drizzle-orm');
const jwt = require('jsonwebtoken')

module.exports = async (client, JWT) => {
    if (!JWT) return null;
    
    let decodedJWT;

    try {
        decodedJWT = jwt.verify(JWT, client.config.web.jwt.secret)
    } catch(e) {
        return null;
    }

    const tokensSchema = client.dbSchema.tokens

    const userData = await client.db.query.tokens.findFirst({
        where: eq(tokensSchema.id, decodedJWT.userId)
    })
    
    if (!userData) return null;
    
    if (new Date().getTime() > new Date(userData?.expiresAt).getTime()) {
        const refreshedTokenData = await client.functions.refreshToken(client, userData.refreshToken)
        
        if (!refreshedTokenData) return null;

        await client.db
            .update(tokensSchema)
            .set(refreshedTokenData)
            .where(
                eq(tokensSchema.id, decodedJWT.userId)
            )

        return refreshedTokenData;
    }
    
    if (userData) return userData;
}