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
        let candidate = await (0, client_access_1.getOneByChatIDAccess)(client.tgid);
        candidate =
            candidate == null
                ? (candidate = await (0, client_access_1.registerAccess)(client))
                : candidate;
        const lover = await (0, client_access_1.getOneByChatIDAccess)(lover_id);
        const lovers = await (0, client_access_1.getLoversByChatIDAccess)(client.tgid);
        console.log(lovers);
        let exists = false;
        if (lovers != null) {
            lovers.forEach((l) => {
                if (l.tgid == lover_id) {
                    exists = true;
                    return;
                }
            });
        }
        if (candidate && lover && !exists)
            return await (0, client_access_1.bindLoverAccess)(client.tgid, lover_id);
        return null;
    }
}
exports.default = Client;
