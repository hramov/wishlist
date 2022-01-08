"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./modules/server"));
const telegram_1 = __importDefault(require("./modules/telegram"));
const dotenv_1 = __importDefault(require("dotenv"));
const parser_1 = __importDefault(require("./modules/parser"));
dotenv_1.default.config();
class Main {
    async start() {
        const server = new server_1.default(Number(process.env.APP_PORT) || 5000);
        const err = await server.createServer();
        if (err) {
            return err;
        }
        const bot = new telegram_1.default(process.env.TOKEN);
        bot.createBot();
        const parser = new parser_1.default({
            // Параметры, которые передаются на вход puppeteer при запуске браузера
            args: [
                "--unhandled-rejections=strict",
                "--disable-notifications",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-sandbox",
            ],
            headless: true,
            // Запуск с графическим режимом только от имени пользователя
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ["--disable-extensions"],
        });
        await parser.create();
    }
}
const main = new Main();
main.start();
