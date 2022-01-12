"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const main_client_1 = __importDefault(require("../../business/client/main.client"));
const logger_1 = __importDefault(require("../logger"));
const cb_handlers_1 = require("./cb_handlers");
const handlers_1 = require("./handlers");
class Telegram {
    constructor(token) {
        this.token = token;
        this.instance = null;
        this.token = token;
    }
    createBot() {
        this.instance = new node_telegram_bot_api_1.default(this.token, { polling: true });
        try {
            this.handler();
        }
        catch (_err) {
            const err = _err;
            logger_1.default.log("error", err.message);
        }
        return this.instance;
    }
    handler() {
        this.instance.on("message", async (msg) => {
            switch (msg.text) {
                case "/start":
                    await (0, handlers_1.start)(this.instance, msg);
                    return;
                case "/info":
                    (0, handlers_1.info)(this.instance, msg);
                    break;
                case "\u2728 Создать желание":
                    await (0, handlers_1.createWishDialog)(this.instance, msg);
                    break;
                case "\u{1F4E6} Посмотреть мои желания":
                    await (0, handlers_1.getMyWishes)(this.instance, msg);
                    break;
                case "\u{1F381} Посмотреть, что подарить":
                    await (0, handlers_1.getMyLovers)(this.instance, msg);
                    break;
                case "\u270C Создать приглашение":
                    await (0, handlers_1.createLink)(this.instance, msg);
                    break;
                case "\u270F Статистика":
                    await (0, handlers_1.createStatLink)(this.instance, msg);
                    break;
            }
            if (msg.text.startsWith("/start ")) {
                try {
                    const lover_tgid = msg.text.split(" ")[1];
                    if (lover_tgid == msg.chat.id.toString()) {
                        await this.instance.sendMessage(msg.chat.id, `Нельзя добавить самого себя`);
                        return;
                    }
                    const lover = await new main_client_1.default().getOneByChatID(lover_tgid);
                    const client = {
                        tgid: msg.from.id.toString(),
                        username: `${msg.from.first_name} ${msg.from.last_name}`,
                    };
                    const result = await new main_client_1.default().bindLover(client, lover_tgid);
                    if (result === true) {
                        await this.instance.sendMessage(msg.chat.id, `Вы получили доступ к виш-листу ${lover.username}`);
                    }
                    else {
                        await this.instance.sendMessage(msg.chat.id, `У вас уже есть доступ к виш-листу ${lover.username}`);
                    }
                }
                catch (_err) {
                    const err = _err;
                    logger_1.default.log("error", err.message);
                    await this.instance.sendMessage(msg.chat.id, "Ошибка");
                }
            }
        });
        this.instance.on("callback_query", async (cb) => {
            const command = cb.data.split(" ")[0];
            switch (command) {
                case "delete":
                    await (0, cb_handlers_1.deleteWishCb)(this.instance, cb);
                    break;
                case "buy":
                    await (0, cb_handlers_1.buyWishCb)(this.instance, cb);
                    break;
                case "show":
                    await (0, cb_handlers_1.showWishCb)(this.instance, cb);
                    break;
                case "hand_yes":
                    await (0, cb_handlers_1.handParseCb)(this.instance, cb);
                    break;
                case "hand_no":
                    await this.instance.answerCallbackQuery(cb.id);
                    await this.instance.sendMessage(cb.from.id, `В таком случае будет доступна только ссылка`);
            }
        });
    }
}
exports.default = Telegram;
