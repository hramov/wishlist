"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUIDByChatID = exports.bindLoverAccess = exports.getLoverByChatIDAccess = exports.getOneByChatIDAccess = exports.registerAccess = void 0;
const __1 = __importDefault(require(".."));
async function registerAccess(client) {
    return await __1.default.getInstance().oneOrNone(`
        INSERT INTO client (
            tgid,
            lover_tgid,
            username,
            created_at
        ) VALUES (
            '${client.tgid}',
            '${client.lover_tgid || "NULL"}',
            '${client.username}',
            current_timestamp
        ) RETURNING id;
    `);
}
exports.registerAccess = registerAccess;
async function getOneByChatIDAccess(id) {
    return await __1.default.getInstance().oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = '${id}';
    `);
}
exports.getOneByChatIDAccess = getOneByChatIDAccess;
async function getLoverByChatIDAccess(id) {
    return await __1.default.getInstance().oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = (SELECT lover_tgid 
          FROM client
          WHERE tgid = '${id}');
    `);
}
exports.getLoverByChatIDAccess = getLoverByChatIDAccess;
async function bindLoverAccess(client_id, lover_id) {
    return await __1.default.getInstance().query(`
    UPDATE client
    SET lover_tgid = '${lover_id}'
    WHERE tgid = '${client_id}';

    UPDATE client
    SET lover_tgid = '${client_id}'
    WHERE tgid = '${lover_id}'
    RETURNING lover_tgid;
  `);
}
exports.bindLoverAccess = bindLoverAccess;
async function getUUIDByChatID(client_id) {
    return await __1.default.getInstance().oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
}
exports.getUUIDByChatID = getUUIDByChatID;
