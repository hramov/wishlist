"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const singletone_1 = require("../../business/decorators/singletone");
const logger_1 = __importDefault(require("../logger"));
const wish_access_1 = __importDefault(require("./access/wish.access"));
let Database = class Database {
    static getInstance() {
        if (!this.instance) {
            try {
                const pgp = (0, pg_promise_1.default)({});
                this.instance = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
                new wish_access_1.default(this.instance);
                logger_1.default.log("info", "Successfully connected to DB");
            }
            catch (err) {
                logger_1.default.log("error", "DB connection error");
                logger_1.default.log("error", err);
                process.exit(1);
            }
        }
        return this.instance;
    }
};
Database = __decorate([
    singletone_1.Singleton
], Database);
exports.default = Database;
