"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const router_1 = __importDefault(require("./router"));
class Server {
    constructor(port) {
        this.port = port;
        this.port = port;
    }
    async createServer() {
        const server = (0, express_1.default)();
        const db = await new database_1.default().connect();
        if (!db.status) {
            return db.err;
        }
        server.use("/api/wishlist/", router_1.default);
        server.use("/", express_1.default.static('public'));
        server.listen(this.port || process.env.APP_PORT, () => {
            console.log(`The server has been started at port ${this.port || process.env.APP_PORT}`);
        });
    }
}
exports.default = Server;
