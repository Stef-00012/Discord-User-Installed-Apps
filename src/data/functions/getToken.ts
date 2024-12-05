import { eq } from 'drizzle-orm';
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Client } from '../../structures/DiscordClient';
import type { DatabaseTokenData, DatabaseUserData } from '../../types/discord';

export default async function (client: Client, JWT: string): Promise<null | DatabaseUserData> {
    if (!JWT || !client.config.web || !client.config.web.enabled) return null;

    let decodedJWT: JwtPayload;

    try {
        decodedJWT = jwt.verify(JWT, client.config.web.jwt.secret) as JwtPayload
    } catch (e) {
        return null;
    }

    const tokensSchema = client.dbSchema.tokens

    const userData: DatabaseUserData | undefined = await client.db.query.tokens.findFirst({
        where: eq(tokensSchema.id, decodedJWT.userId)
    })

    if (!userData) return null;

    if (new Date().getTime() > new Date(userData?.expiresAt).getTime()) {
        const refreshedTokenData: DatabaseTokenData = await client.functions.refreshToken(client, userData.refreshToken)

        if (!refreshedTokenData) return null;

        const updatedUserData: DatabaseUserData = (await client.db
            .update(tokensSchema)
            .set(refreshedTokenData)
            .where(
                eq(tokensSchema.id, decodedJWT.userId)
            )
            .returning({
                id: tokensSchema.id,
                accessToken: tokensSchema.accessToken,
                refreshToken: tokensSchema.refreshToken,
                expiresAt: tokensSchema.expiresAt,
                scopes: tokensSchema.scopes
            }))[0]

        return updatedUserData
    }

    return userData;
}