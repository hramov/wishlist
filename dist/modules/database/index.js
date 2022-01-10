"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const fs = __importStar(require("fs"));
const logger_1 = __importDefault(require("../logger"));
class Database {
    constructor() {
        if (Database.exists)
            return Database.instance;
        Database.instance = this;
        Database.exists = true;
    }
    async connect() {
        Database.conn = Database.pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        try {
            // await Database.init();
            return {
                status: true,
                err: null,
            };
        }
        catch (_err) {
            const err = _err;
            return {
                status: false,
                err: err,
            };
        }
    }
    static getInstance() {
        return Database.conn;
    }
    static async init() {
        const exists = await Database.conn.oneOrNone(Database.readSql("check_init.sql"));
        if (!exists) {
            if (Database.exists) {
                try {
                    const initSQL = Database.readSql("hand_init.sql");
                    await Database.conn.query(initSQL);
                }
                catch (_err) {
                    const err = _err;
                    logger_1.default.log("error", err.message);
                    return {
                        status: false,
                        err: err,
                    };
                }
            }
            else {
                return {
                    status: false,
                    err: {
                        name: "Database error",
                        message: "No database connected",
                    },
                };
            }
        }
        Database.isInit = true;
    }
    static readSql(filePath) {
        return fs.readFileSync(`static/sql/${filePath}`).toString();
    }
}
exports.default = Database;
Database.exists = false;
Database.instance = null;
Database.isInit = false;
Database.pgp = (0, pg_promise_1.default)({});
