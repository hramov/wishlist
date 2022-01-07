"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function parseHTML(url) {
    const result = await axios_1.default.get(url);
    console.log(result.data);
    // const root = parse('<ul id="list"><li>Hello World</li></ul>');
}
exports.default = parseHTML;
