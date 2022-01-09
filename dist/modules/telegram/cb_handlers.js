"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showWishCb = exports.buyWishCb = exports.deleteWishCb = void 0;
const main_wish_1 = __importDefault(require("../../business/wish/main.wish"));
const wish_access_1 = require("../database/access/wish.access");
async function deleteWishCb(instance, cb) {
    await instance.answerCallbackQuery(cb.id);
    const result = await (0, wish_access_1.deleteWishByID)(Number(cb.data.split(" ")[1]));
    if (result != null) {
        await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
        return;
    }
    await instance.sendMessage(cb.from.id, `Ошибка при удалении желания!`);
}
exports.deleteWishCb = deleteWishCb;
async function buyWishCb(instance, cb) {
    await instance.answerCallbackQuery(cb.id);
    const result = await new main_wish_1.default(null).markWishAsGifted(Number(cb.data.split(" ")[1]), cb.from.id);
    if (result != null) {
        await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
        await instance.sendMessage(cb.from.id, `Желание успешно получено!`);
        return;
    }
    await instance.sendMessage(cb.from.id, `Ошибка при получении желания!`);
}
exports.buyWishCb = buyWishCb;
async function showWishCb(instance, cb) {
    await instance.answerCallbackQuery(cb.id);
    const result = await new main_wish_1.default(null).getWishesByID(cb.data.split(" ")[1]);
    if (result != null && result.length > 0) {
        result.forEach(async (wish) => {
            await instance.sendMessage(cb.from.id, `
${wish.title}
${wish.price}
${wish.href}
        `);
        });
    }
    else {
        await instance.sendMessage(cb.from.id, "Виш-лист пользователя пуст");
    }
}
exports.showWishCb = showWishCb;
