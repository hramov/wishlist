"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timing = void 0;
const logger_1 = __importDefault(require("../../modules/logger"));
function Timing(target, propertyKey, descriptor) {
    const value = descriptor.value;
    descriptor.value = function (...args) {
        const start = Date.now();
        const result = value.apply(this, args);
        const elapsed = (Date.now() - start) / 1000; //sec.
        logger_1.default.log("debug", `Function ${propertyKey} take ${elapsed} sec.`);
        return result;
    };
}
exports.Timing = Timing;
