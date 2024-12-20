export interface McstatusIoJavaServerResponse {
	online: boolean;
	host: string;
	port: number;
	ip_address: string | null;
	eula_blocked: boolean;
	retrieved_at: number;
	expires_at: number;
	version: McstatusIoJavaServerResponseVersion | null;
	players: McstatusIoJavaServerResponsePlayers;
	motd: McstatusIoGeneralServerResponseMotd;
	icon: string | null;
	mods: Array<McstatusIoJavaServerResponseMod>;
	software: string | null;
	plugins: Array<McstatusIoJavaServerResponsePlugin>;
	srv_record: McstatusIoJavaServerResponseSrvRecord;
}

export interface McstatusIoJavaServerResponseVersion {
	name_raw: string;
	name_clean: string;
	name_html: string;
	protocol: number;
}

export interface McstatusIoJavaServerResponsePlayers {
	online: number;
	max: number;
	list: Array<McstatusIoJavaServerResponsePlayer>;
}

export interface McstatusIoJavaServerResponsePlayer {
	uuid: string;
	name_raw: string;
	name_clean: string;
	name_html: string;
}

export interface McstatusIoGeneralServerResponseMotd {
	raw: string;
	clean: string;
	html: string;
}

export interface McstatusIoJavaServerResponseMod {
	name: string;
	version: string;
}

export interface McstatusIoJavaServerResponsePlugin {
	name: string;
	version: string | null;
}

export interface McstatusIoJavaServerResponseSrvRecord {
	host: string;
	port: number;
}

export interface McstatusIoBedrockServerResponse {
	online: boolean;
	host: string;
	port: number;
	ip_address: string | null;
	eula_blocked: boolean;
	retrieved_at: number;
	expires_at: number;
	version: McstatusIoBedrockServerResponseVersion;
	players: McstatusIoBedrockServerResponsePlayers;
	motd: McstatusIoGeneralServerResponseMotd;
	gamemode: string;
	server_id: string;
	edition: "MCPE" | "MCEE";
}

export interface McstatusIoBedrockServerResponseVersion {
	name: string;
	protocol: number;
}

export interface McstatusIoBedrockServerResponsePlayers {
	online: number;
	max: number;
}
