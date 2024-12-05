import type { Client } from "../structures/DiscordClient"
import type { DatabaseTokenData, DatabaseUserData } from "./discord";
import type { McstatusIoBedrockServerResponse, McstatusIoJavaServerResponse } from "./mcstatus.io";

export interface Functions {
    getAccessToken: (client: Client, code: string) => Promise<string | null>;
    getMCBedrockServerStatus: (address: string) => Promise<McstatusIoBedrockServerResponse | null>;
    getMCJavaServerStatus: (address: string) => Promise<McstatusIoJavaServerResponse | null>;
    getToken: (client: Client, JWT: string) => Promise<DatabaseUserData | null>;
    init: () => Promise<void>;
    refreshToken: (client: Client, token: string) => Promise<DatabaseTokenData | null>;
    revokeAccessToken: (client: Client, token: string, tokenType: string) => Promise<boolean | null>
}