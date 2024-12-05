import type { APIEmbed } from "discord.js";

export interface TagData {
    content?: string | null;
    embeds?: Array<APIEmbed> | null
}

export interface SendTagData {
    content?: string | undefined;
    embeds?: Array<APIEmbed> | undefined
}

export interface ImportTag {
    name: string;
    data: ImportTagData;
}

export interface ImportTagData {
    content?: string | null;
    embeds?: Array<APIEmbed> | null;
}

export interface Tag {
    id: string;
    name: string;
    data: string;
}