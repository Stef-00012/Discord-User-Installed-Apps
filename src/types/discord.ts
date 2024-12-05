export interface DatabaseTokenData {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    scopes: string;
}

export interface DatabaseUserData {
    id: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    scopes: string | null;
}