//https://mcstatus.io/docs#routes
import axios from "axios";
import type { McstatusIoBedrockServerResponse } from "../../types/mcstatus.io";

export default async function (address: string): Promise<McstatusIoBedrockServerResponse | null> {
	const endpoint = `https://api.mcstatus.io/v2/status/bedrock/${address}`;

	try {
		const req = await axios.get(endpoint);

		return req.data as McstatusIoBedrockServerResponse;
	} catch (e) {
		return null;
	}
};
