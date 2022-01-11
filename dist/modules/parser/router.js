"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ozon_site_1 = __importDefault(require("./sites/ozon.site"));
const selectors_json_1 = require("./conf/selectors.json");
const logger_1 = __importDefault(require("../logger"));
class Router {
    constructor(page) {
        this.page = page;
        this.page = page;
    }
    async route(url) {
        const hostname = new URL(url).hostname;
        switch (hostname) {
            case "www.ozon.ru":
                const result = await (0, ozon_site_1.default)(this.page, selectors_json_1.items.ozon);
                if (result) {
                    return Object.assign({ href: url }, result);
                }
                break;
            default: {
                logger_1.default.log("warning", `Unsupported shop hostname: ${hostname}`);
                return {
                    href: url,
                };
            }
        }
        return null;
    }
}
exports.default = Router;
