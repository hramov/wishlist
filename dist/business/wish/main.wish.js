"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wish_access_1 = require("../../modules/database/access/wish.access");
const parser_1 = __importDefault(require("../../modules/parser"));
const main_client_1 = __importDefault(require("../client/main.client"));
class Wish {
    constructor(href) {
        this.href = href;
        this.href = href;
    }
    async create(client_id) {
        try {
            const result = await new parser_1.default(null).parse(this.href, client_id);
            if (result != null) {
                await (0, wish_access_1.createWishAccess)(result);
                return result;
            }
        }
        catch (_err) {
            const err = _err;
            console.log(err.message);
        }
        return null;
    }
    async getMyWishes(client_id) {
        const result = await new main_client_1.default().getOneByChatID(client_id);
        if (result != null && result.id) {
            return await (0, wish_access_1.getWishesByID)(result.id);
        }
        return null;
    }
    async getMyLoverWishes(client_id) {
        const result = await new main_client_1.default().getLoverByChatID(client_id);
        if (result != null && result.id) {
            return await (0, wish_access_1.getWishesByID)(result.id);
        }
        return null;
    }
    async deleteWish(id) {
        return await (0, wish_access_1.deleteWishByID)(id);
    }
    async markWishAsGifted(wish_id, client_id) {
        return await (0, wish_access_1.buyWish)(wish_id, client_id);
    }
    async stats(client_uuid) {
        return await (0, wish_access_1.getSpendedMoney)(client_uuid);
    }
}
exports.default = Wish;
