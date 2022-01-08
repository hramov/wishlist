"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const router_1 = __importDefault(require("./router"));
const default_json_1 = require("./conf/default.json");
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
            catch (err) {
                await page.close();
                this.pages--;
                console.log(err);
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
}
exports.default = Parser;
Parser.exists = false;
Parser.instance = null;
