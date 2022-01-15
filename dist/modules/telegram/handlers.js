"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handParse = exports.createStatLink = exports.buyWishDialog = exports.buyWishHandler = exports.createLink = exports.deleteWish = exports.getMyLovers = exports.getMyWishes = exports.createWishDialog = exports.createWish = exports.start = exports.info = void 0;
const main_client_1 = __importDefault(require("../../business/client/main.client"));
const main_wish_1 = __importDefault(require("../../business/wish/main.wish"));
const keyboard_1 = require("./keyboard");
const client_access_1 = __importDefault(require("../database/access/client.access"));
const logger_1 = __importDefault(require("../logger"));
async function info(instance, msg) {
    await instance.sendMessage(msg.from.id, `
Привет! Это бот, который помогает в выборе подарков.
Можно добавить сколько угодно пользователей Telegram, чтобы видеть их виш-листы.

Для начала использования бота и регистрации системы используйте команду /start
  `);
    return null;
}
exports.info = info;
async function start(instance, msg) {
    const candidate = await new main_client_1.default().getOneByChatID(msg.from.id.toString());
    if (!candidate) {
        const client = await new main_client_1.default().register({
            tgid: msg.from.id.toString(),
            username: `${msg.from.first_name} ${msg.from.last_name}`,
        });
        if (client && client.id) {
            await instance.sendMessage(msg.from.id, `Вы были успешно зарегистрированы! Ваш Chat ID: ${msg.from.id}`);
        }
        logger_1.default.log("info", `Пользователь ${msg.from.first_name} ${msg.from.last_name} успешно зарегистрировался`);
    }
    else {
        await instance.sendMessage(msg.from.id, `Вы уже зарегистрированы! Ваш Chat ID: ${msg.from.id}`);
    }
    await instance.sendMessage(msg.chat.id, "Выберите действие ниже", keyboard_1.startKeyboard);
    return null;
}
exports.start = start;
async function createWish(instance, msg) {
    new main_wish_1.default()
        .create(msg.chat.id.toString(), new URL(msg.text).toString())
        .then(async (data) => {
        if (!data.isAuto) {
            logger_1.default.log("warning", `Unsupported hostname ${new URL(msg.text).hostname}`);
            await handParse(instance, msg, data.id);
            return;
        }
        logger_1.default.log("info", `Желание с ID=${data.id} добавлено в очередь на обработку`);
        instance.sendMessage(msg.chat.id, "Добавлено в очередь на обработку...");
    });
    return null;
}
exports.createWish = createWish;
async function createWishDialog(instance, msg) {
    await instance.sendMessage(msg.chat.id, "Введите ссылку на товар");
    instance.once("message", async (msg) => {
        try {
            new URL(msg.text.toString());
            await createWish(instance, msg);
        }
        catch (_err) {
            const err = _err;
            logger_1.default.log("error", err.message);
            await instance.sendMessage(msg.chat.id, "Неверный формат ссылки!");
        }
    });
    return null;
}
exports.createWishDialog = createWishDialog;
async function getMyWishes(instance, msg) {
    const result = await new main_wish_1.default().getWishesByID(msg.chat.id.toString());
    if (result != null && result.length > 0) {
        result.forEach(async (item) => {
            instance.sendMessage(msg.chat.id, `
${item.title || "Название: (еще нет данных)"}
Цена: ${item.price || "(еще нет данных)"} рублей
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
async function getMyLovers(instance, msg) {
    const result = await new main_client_1.default().getLoversByChatID(msg.from.id.toString());
    const items = [[]];
    result.forEach((item) => {
        items.push(new Array({
            text: item.username,
            callback_data: `show ${item.tgid.toString()}`,
        }));
    });
    if (result != null && result.length > 0) {
        await instance.sendMessage(msg.chat.id, "Добавленные пользователи", {
            reply_markup: {
                inline_keyboard: items,
            },
        });
        return;
    }
    await instance.sendMessage(msg.chat.id, "Нечего дарить :-(");
}
exports.getMyLovers = getMyLovers;
async function deleteWish(instance, msg) {
    const result = await new main_wish_1.default().deleteWish(Number(msg.text));
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
        const result = new main_wish_1.default().markWishAsGifted(Number(msg.text), msg.chat.id);
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
    const uuid = await new client_access_1.default().getUUIDByChatID(msg.chat.id);
    if (uuid != null && uuid.uuid) {
        const result = `${process.env.PROTOCOL || "http"}://${process.env.APP_HOST || "hramovdev.ru"}:${process.env.APP_PORT}/api/wishlist/statistics/${uuid.uuid}`;
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
async function handParse(instance, msg, wish_id) {
    await instance.sendMessage(msg.chat.id, `
В данный момент с этого сайта недоступен автоматический сбор информации. 
Ввести самостоятельно?
  `, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Да",
                        // Too large chunk of data crashes the app
                        callback_data: `hand_yes ${wish_id}`,
                    },
                    {
                        text: "Нет",
                        callback_data: "hand_no",
                    },
                ],
            ],
        },
    });
}
exports.handParse = handParse;
