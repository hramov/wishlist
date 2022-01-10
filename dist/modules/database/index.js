"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const logger_1 = __importDefault(require("../logger"));
class Database {
    static getInstance() {
        if (!this.instance) {
            try {
                const pgp = (0, pg_promise_1.default)({});
                this.instance = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
                logger_1.default.log("info", "Успешно подключился к БД");
            }
            catch (err) {
                logger_1.default.log("error", "Ошибка подключения к БД");
                logger_1.default.log("error", err);
                process.exit(1);
            }
        }
        return this.instance;
    }
}
exports.default = Database;
