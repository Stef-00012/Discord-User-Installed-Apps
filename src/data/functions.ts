import fs from "node:fs";

const functions: {
    [key: string]: (...args: any[]) => any | Promise<any>;
} = {};

const funcs = fs
    .readdirSync(`${__dirname}/functions`)
    .filter((file) => file.endsWith(".ts"));

for (const func of funcs) {
    const funcData: (...args: any[]) => any | Promise<any>= (await import(`${__dirname}/functions/${func}`)).default

    functions[func.split(".")[0]] = funcData
}

export default functions;