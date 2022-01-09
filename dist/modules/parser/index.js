"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const router_1 = __importDefault(require("./router"));
const default_json_1 = require("./conf/default.json");
const wish_access_1 = require("../database/access/wish.access");
const logger_1 = __importDefault(require("../logger"));
class Parser {
    constructor(options) {
        this.options = options;
        this.browser = null;
        this.isStarted = false;
        this.pages = 0;
        if (!Parser.exists) {
            this.options = options;
            Parser.exists = true;
            Parser.instance = this;
        }
        return Parser.instance;
    }
    async create() {
        if (!this.isStarted) {
            this.browser = await puppeteer_1.default.launch(this.options);
            this.isStarted = true;
        }
        return this.browser;
    }
    async parse(url, client_id) {
        if (this.pages < Number(process.env.MAX_PAGES || 3)) {
            logger_1.default.log("info", `Начинаю обработку запроса: ${url}`);
            const page = await this.browser.newPage();
            this.pages++;
            try {
                page.setDefaultNavigationTimeout(15000);
                await page.setUserAgent(await this.getUserAgent());
                await page.setViewport({
                    width: 1920,
                    height: 1080,
                });
                await page.goto(url);
                const router = new router_1.default(page);
                const result = await router.route(url);
                await page.close();
                this.pages--;
                if (result) {
                    return Object.assign({ client_id }, result);
                }
            }
            catch (_err) {
                const err = _err;
                await page.close();
                this.pages--;
                logger_1.default.log("error", `Ошибка обработки запроса: ${err.message}`);
            }
        }
        else {
            return null;
        }
        return null;
    }
    async getUserAgent() {
        return default_json_1.userAgents[Math.ceil(Math.random() * (default_json_1.userAgents.length - 1))];
    }
    async destroy() {
        await this.browser.close();
        this.isStarted = false;
        Parser.exists = false;
        Parser.instance = null;
    }
    async demon(instance) {
        setInterval(async () => {
            const hrefs = await (0, wish_access_1.getUnmanagedWishes)();
            for (let i = 0; i < hrefs.length; i++) {
                try {
                    const wish = await this.parse(hrefs[i].href, hrefs[i].client_id);
                    await (0, wish_access_1.createWishAccess)(wish);
                    logger_1.default.log("info", `Успешно обработал запрос: ${hrefs[i].href}`);
                    await (0, wish_access_1.deleteManaged)(hrefs[i].id);
                    await instance.sendMessage(hrefs[i].client_id, `Успешно обработал запрос: ${hrefs[i].href}`);
                }
                catch (_err) {
                    const err = _err;
                    logger_1.default.log("error", `Ошибка при обработке запроса: ${err.message}`);
                }
                await this.timeout(15000);
            }
        }, 10000);
    }
    timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.default = Parser;
Parser.exists = false;
Parser.instance = null;
