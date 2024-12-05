export interface PterodactylAccount {
    id: number;
    admin: boolean;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: string;
}

export interface PterodactylServer {
    server_owner: boolean;
    identifier: string;
    uuid: string;
    name: string;
    node: string;
    sftp_details: PterodactylServerSftpDetails;
    description: string;
    limits: PterodactylServerLimits;
    feature_limits: PterodactylServerFeatureLimits;
    is_suspended: boolean;
    is_installing: boolean;
    relationships: PterodactylServerRelationships;
    meta: PterodactylServerMeta;
}

export interface PterodactylServerSftpDetails {
    ip: string;
    port: boolean;
}

export interface PterodactylServerLimits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
}

export interface PterodactylServerFeatureLimits {
    databases: number;
    allocations: number;
    backups: number;
}

export interface PterodactylServerRelationships {
    allocations: PterodactylServerRelationshipAllocation;
}

export interface PterodactylServerRelationshipAllocation {
    object: "list",
    data: Array<PterodactylServerRelationshipAllocationData>;
}

export interface PterodactylServerRelationshipAllocationData {
    object: "allocation",
    attributes: PterodactylServerRelationshipAllocationDataAllocation;
}

export interface PterodactylServerRelationshipAllocationDataAllocation {
    id: number;
    ip: string;
    ip_alias: string | null;
    port: number;
    notes: string | null;
    is_default: boolean;
}

export interface PterodactylServerMeta {
    is_server_owner: boolean;
    user_permissions: Array<string>;
}

export interface PterodactylAPIServer {
    object: "server",
    attributes: PterodactylServer
}

export type PterodactylPowerActions = "start" | "stop" | "restart" | "kill"