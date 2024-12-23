import { createApp } from "@src/app.js";
import { port } from "@src/config/server.js";
import { Server } from "@src/server.js";

console.log("a1");
const server = new Server(await createApp());
console.log("a");
await server.start(port);
console.log("b");

console.log(`[server]: Server is running at ${server.url}`);

export default server;
