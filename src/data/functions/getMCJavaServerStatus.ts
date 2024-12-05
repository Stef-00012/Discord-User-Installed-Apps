//https://mcstatus.io/docs#routes
import axios from "axios";
import type { McstatusIoJavaServerResponse } from "../../types/mcstatus.io";

export default async function(address: string): Promise<McstatusIoJavaServerResponse | null> {
	const endpoint = `https://api.mcstatus.io/v2/status/java/${address}`;

	try {
		const req = await axios.get(endpoint);

		return req.data as McstatusIoJavaServerResponse;
	} catch (e) {
		return null;
	}
};
