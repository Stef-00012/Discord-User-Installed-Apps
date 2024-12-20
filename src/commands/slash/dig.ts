import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import { execSync } from "node:child_process";
import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";

export default {
	name: "dig",
	requires: [],

	async autocomplete(client: Client, int: AutocompleteInteraction) {
		const value = int.options.getFocused();

		const records = [
			{ name: "A", value: "A" },
			{ name: "AAAA", value: "AAAA" },
			{ name: "CAA", value: "CAA" },
			{ name: "CERT", value: "CERT" },
			{ name: "CNAME", value: "CNAME" },
			{ name: "MX", value: "MX" },
			{ name: "NS", value: "NS" },
			{ name: "SPF", value: "SPF" },
			{ name: "SRV", value: "SRV" },
			{ name: "TXT", value: "TXT" },
			{ name: "DNSKEY", value: "DNSKEY" },
			{ name: "DS", value: "DS" },
			{ name: "LOC", value: "LOC" },
			{ name: "URI", value: "URI" },
			{ name: "HTTPS", value: "HTTPS" },
			{ name: "NAPTR", value: "NAPTR" },
			{ name: "PTR", value: "PTR" },
			{ name: "SMIMEA", value: "SMIMEA" },
			{ name: "SOA", value: "SOA" },
			{ name: "SSHFP", value: "SSHFP" },
			{ name: "SVCB", value: "SVCB" },
			{ name: "TLSAHINFO", value: "TLSAHINFO" },
			{ name: "CDS", value: "CDS" },
			{ name: "CDNSKEY", value: "CDNSKEY" },
			{ name: "AFSDB", value: "AFSDB" },
			{ name: "APL", value: "APL" },
			{ name: "CSYNC", value: "CSYNC" },
			{ name: "DHCID", value: "DHCID" },
			{ name: "DLV", value: "DLV" },
			{ name: "DNAME", value: "DNAME" },
			{ name: "EUI48", value: "EUI48" },
			{ name: "EUI64", value: "EUI64" },
			{ name: "HIP", value: "HIP" },
			{ name: "IPSECKEY", value: "IPSECKEY" },
			{ name: "KEY", value: "KEY" },
			{ name: "KX", value: "KX" },
			{ name: "NSEC", value: "NSEC" },
			{ name: "NSEC3", value: "NSEC3" },
			{ name: "NSEC3PARAM", value: "NSEC3PARAM" },
		];

		let matches = records.filter((tag) =>
			tag.name.toLowerCase().startsWith(value),
		);

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const domain = int.options.getString("domain", true);
		const recordType = int.options.getString("record") || "A";
		const short = int.options.getBoolean("short") || false;
		const provider = int.options.getString("provider") || "1.1.1.1";
		const cdflag = int.options.getBoolean("cdflag") || false;

		await int.deferReply();

		const command = `dig ${domain} ${recordType} @${provider} +noall +answer${
			short ? " +short" : ""
		}${cdflag ? " +cdflag" : ""}`;

		let output: string;

		try {
			output = execSync(command).toString().trim();
		} catch (e) {
			const error = e.stderr.toString().trim();

			if (error.includes("not found"))
				return await int.editReply({
					content: "`dig` is not installed on the system",
				});

			console.log(error);

			return await int.editReply({
				content: "Something went wrong...",
			});
		}

		if (!output || output.length <= 0)
			return await int.editReply({
				content: "This query returned no response",
			});

		if (output.length > 4060) output = `${output.substr(0, 4060)}...`;

		const embed = new EmbedBuilder().setDescription(
			`\`${command}\`\n\`\`\`txt\n${output}\n\`\`\``,
		);

		await int.editReply({
			embeds: [embed],
		});
	},
} as Command;
