"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_access_1 = require("../../modules/database/access/client.access");
class Client {
    async register(client) {
        return await (0, client_access_1.registerAccess)(client);
    }
    getOne(id) {
        return null;
    }
    async getOneByChatID(id) {
        return await (0, client_access_1.getOneByChatIDAccess)(id);
    }
    async getLoverByChatID(id) {
        return await (0, client_access_1.getLoverByChatIDAccess)(id);
    }
    delete(id) {
        return null;
    }
    getLover(id) {
        return null;
    }
    async createLink(tgid) {
        return `https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
    }
    async bindLover(client_id, lover_id) {
        const client = await (0, client_access_1.getOneByChatIDAccess)(client_id);
        if (client == null) {
            await (0, client_access_1.registerAccess)({
                tgid: client_id,
                username: "",
            });
        }
        const lover = await (0, client_access_1.getOneByChatIDAccess)(lover_id);
        if (client && lover)
            return await (0, client_access_1.bindLoverAccess)(client_id, lover_id);
        return null;
    }
}
exports.default = Client;
