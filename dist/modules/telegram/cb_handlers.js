"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handParseCb = exports.showWishCb = exports.buyWishCb = exports.deleteWishCb = void 0;
const error_1 = require("../../business/validation/error");
const main_wish_1 = __importDefault(require("../../business/wish/main.wish"));
const wish_access_1 = __importDefault(require("../database/access/wish.access"));
const logger_1 = __importDefault(require("../logger"));
async function deleteWishCb(instance, cb) {
    await instance.answerCallbackQuery(cb.id);
    const result = await new wish_access_1.default().deleteWishByID(Number(cb.data.split(" ")[1]));
    if (result != null) {
        await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
        await instance.sendMessage(cb.from.id, `Желание успешно удалено`);
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
    const result = await new main_wish_1.default(null).getWishesByID(cb.data.split(" ")[1]);
    await instance.answerCallbackQuery(cb.id);
    if (result != null && result.length > 0) {
        result.forEach(async (wish) => {
            await instance.sendMessage(cb.from.id, `
${wish.title || `Название: (еще нет данных)`}
Цена: ${wish.price || "(еще нет данных)"} рублей
${wish.href}
        `);
        });
    }
    else {
        await instance.sendMessage(cb.from.id, "Виш-лист пользователя пуст");
    }
}
exports.showWishCb = showWishCb;
async function handParseCb(instance, cb) {
    const wish = await new main_wish_1.default().getWishByID(Number(cb.data.split(" ")[1]));
    await instance.answerCallbackQuery(cb.id);
    await instance.sendMessage(cb.from.id, `Введите название:`);
    instance.once("message", async (msg) => {
        wish.title = msg.text.toString();
        await instance.sendMessage(cb.from.id, `Введите цену:`);
        instance.once("message", async (msg) => {
            try {
                wish.price = parseInt(msg.text);
                if (Number.isNaN(wish.price)) {
                    throw new error_1.ValidationError("result.price is NaN");
                }
                await new wish_access_1.default().createWishAccess(wish);
                await instance.sendMessage(cb.from.id, `Успешно добавлено желание ${wish.href}`);
            }
            catch (_err) {
                const err = _err;
                logger_1.default.log("error", err.message);
                await instance.sendMessage(cb.from.id, `Ошибка при обработке желания!`);
            }
        });
    });
}
exports.handParseCb = handParseCb;
