"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ozon_site_1 = __importDefault(require("./sites/ozon.site"));
const selectors_json_1 = require("./conf/selectors.json");
class Router {
    constructor(page) {
        this.page = page;
        this.page = page;
    }
    async route(url) {
        switch (new URL(url).hostname) {
            case "www.ozon.ru":
                const result = await (0, ozon_site_1.default)(this.page, selectors_json_1.items.ozon);
                if (result) {
                    return Object.assign({ href: url }, result);
                }
        }
        return null;
    }
}
exports.default = Router;
