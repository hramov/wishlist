"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatLink = exports.buyWishDialog = exports.buyWishHandler = exports.createLink = exports.deleteWish = exports.getMyLoverWishes = exports.getMyWishes = exports.createWishDialog = exports.createWish = exports.start = exports.info = void 0;
const main_client_1 = __importDefault(require("../../business/client/main.client"));
const main_wish_1 = __importDefault(require("../../business/wish/main.wish"));
const keyboard_1 = require("./keyboard");
const client_access_1 = require("../database/access/client.access");
async function info(instance, msg) {
    await instance.sendMessage(msg.from.id, "Hello");
    return null;
}
exports.info = info;
async function start(instance, msg) {
    const candidate = await new main_client_1.default().getOneByChatID(msg.from.id);
    if (!candidate) {
        const { id } = await new main_client_1.default().register({
            tgid: msg.from.id,
            username: msg.from.username,
        });
        if (id) {
            await instance.sendMessage(msg.from.id, `Вы были успешно зарегистрированы! Ваш Chat ID: ${msg.from.id}`);
        }
        console.log(`Пользователь ${id} успешно зарегистрировался`);
    }
    else {
        await instance.sendMessage(msg.from.id, `Вы уже зарегистрированы! Ваш Chat ID: ${msg.from.id}`);
    }
    await instance.sendMessage(msg.chat.id, "Выберите действие ниже", keyboard_1.startKeyboard);
    return null;
}
exports.start = start;
async function createWish(instance, msg) {
    await instance.sendMessage(msg.chat.id, "Начинаю обработку...");
    const result = await new main_wish_1.default(new URL(msg.text).toString()).create(msg.chat.id);
    if (result != null) {
        await instance.sendMessage(msg.chat.id, `
Успешно обработал: 
${result.title} 
Стоимость: ${result.price} руб.`);
    }
    else {
        await instance.sendMessage(msg.chat.id, "Ошибка при обработке...");
    }
    console.log(result);
    return null;
}
exports.createWish = createWish;
async function createWishDialog(instance, msg) {
    await instance.sendMessage(msg.chat.id, "Введите ссылку на товар");
    instance.once("message", async (msg) => {
        if (msg.text.startsWith("http")) {
            await createWish(instance, msg);
        }
        else {
            await instance.sendMessage(msg.chat.id, "Неверный формат ссылки!");
        }
    });
    return null;
}
exports.createWishDialog = createWishDialog;
async function getMyWishes(instance, msg) {
    const result = await new main_wish_1.default(null).getMyWishes(msg.chat.id);
    console.log(result);
    if (result != null && result.length > 0) {
        result.forEach(async (item) => {
            instance.sendMessage(msg.chat.id, `
${item.title}
Цена: ${item.price} рублей
${item.href}
        `, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "\u2705 Подарили",
                                callback_data: `buy ${item.id.toString()}`,
                            },
                            {
                                text: "\u2716 Удалить",
                                callback_data: `delete ${item.id.toString()}`,
                            },
                        ],
                    ],
                },
            });
        });
        return;
    }
    await instance.sendMessage(msg.chat.id, "Нет добавленных желаний");
}
exports.getMyWishes = getMyWishes;
async function getMyLoverWishes(instance, msg) {
    const result = await new main_wish_1.default(null).getMyLoverWishes(msg.chat.id);
    console.log(result);
    if (result != null && result.length > 0) {
        result.forEach(async (item) => {
            await instance.sendMessage(msg.chat.id, `
${item.title}
Цена: ${item.price} рублей
${item.href}
        `);
        });
        return;
    }
    await instance.sendMessage(msg.chat.id, "Нечего дарить :-(");
}
exports.getMyLoverWishes = getMyLoverWishes;
async function deleteWish(instance, msg) {
    const result = await new main_wish_1.default(null).deleteWish(Number(msg.text));
    if (result != null) {
        await instance.sendMessage(msg.chat.id, `Желание с ID ${Number(msg.text)} успешно удалено`);
        return;
    }
    await instance.sendMessage(msg.chat.id, `Ошибка во время удаления желания`);
}
exports.deleteWish = deleteWish;
async function createLink(instance, msg) {
    const link = await new main_client_1.default().createLink(msg.chat.id);
    await instance.sendMessage(msg.chat.id, link);
    return;
}
exports.createLink = createLink;
async function buyWishHandler(instance, msg) {
    try {
        const result = new main_wish_1.default(null).markWishAsGifted(Number(msg.text), msg.chat.id);
        if (result) {
            await instance.sendMessage(msg.chat.id, "Успешно отмечено");
            return;
        }
    }
    catch (err) {
        await instance.sendMessage(msg.chat.id, "Произошла ошибка");
    }
}
exports.buyWishHandler = buyWishHandler;
async function buyWishDialog(instance, msg) {
    await instance.sendMessage(msg.chat.id, "Введите ID желания");
    instance.once("message", async (msg) => {
        if (!isNaN(Number(msg.text))) {
            await buyWishHandler(instance, msg);
        }
    });
}
exports.buyWishDialog = buyWishDialog;
async function createStatLink(instance, msg) {
    const uuid = await (0, client_access_1.getUUIDByChatID)(msg.chat.id);
    if (uuid != null && uuid.uuid) {
        console.log(uuid.uuid);
        const result = `${process.env.PROTOCOL || "http"}://${process.env.APP_HOST || "hramovdev.ru"}:${process.env.APP_PORT}/api/wishlist/statistics/${uuid.uuid}`;
        console.log(result);
        await instance.sendMessage(msg.chat.id, `
Ваша ссылка на статистику:
${result}
  `);
        return;
    }
    await instance.sendMessage(msg.chat.id, `
Проблемы с генерацией ссылки...
`);
}
exports.createStatLink = createStatLink;
