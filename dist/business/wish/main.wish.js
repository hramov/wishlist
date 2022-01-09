"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wish_access_1 = require("../../modules/database/access/wish.access");
class Wish {
    constructor(href) {
        this.href = href;
        this.href = href;
    }
    async create(client_id) {
        const result = await (0, wish_access_1.createMinWishAccess)(client_id, this.href);
        if (result && result.id)
            return result;
    }
    async getWishesByID(client_id) {
        return await (0, wish_access_1.getWishesByID)(client_id);
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
