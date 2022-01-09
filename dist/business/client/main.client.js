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
    async getLoversByChatID(id) {
        return await (0, client_access_1.getLoversByChatIDAccess)(id);
    }
    delete(id) {
        return null;
    }
    getLover(id) {
        return null;
    }
    async createLink(tgid) {
        return `
Присоединяйся ко мне в Wish List Exchange \u{1F64C}:
https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
    }
    async bindLover(client, lover_id) {
        const candidate = await (0, client_access_1.getOneByChatIDAccess)(client.tgid);
        if (!candidate || !candidate.id) {
            client = await (0, client_access_1.registerAccess)(client);
        }
        return (await (0, client_access_1.bindLoverAccess)(client.tgid, lover_id)).result;
    }
}
exports.default = Client;
