import fs from "node:fs";
import type { Functions } from "../types/functions";

const functions = {};

const funcs = fs
    .readdirSync(`${__dirname}/functions`)
    .filter((file) => file.endsWith(".ts"));

for (const func of funcs) {
    const funcData: (...args: any[]) => any | Promise<any> = (await import(`${__dirname}/functions/${func}`)).default

    functions[func.split(".")[0]] = funcData
}

export default functions as Functions;