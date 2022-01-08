"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUIDByChatID = exports.bindLoverAccess = exports.getLoversByChatIDAccess = exports.getOneByChatIDAccess = exports.registerAccess = void 0;
const __1 = __importDefault(require(".."));
async function registerAccess(client) {
    return await __1.default.getInstance().oneOrNone(`
        INSERT INTO client (
            tgid,
            username,
            created_at
        ) VALUES (
            '${client.tgid}',
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
async function getLoversByChatIDAccess(id) {
    return await __1.default.getInstance().oneOrNone(`
        SELECT * 
        FROM client_lover 
        WHERE client_id = (
          SELECT id from client WHERE tgid = ${id}
        )
    `);
}
exports.getLoversByChatIDAccess = getLoversByChatIDAccess;
async function bindLoverAccess(client_id, lover_id) {
    return await __1.default.getInstance().query(`
    INSERT INTO client_lover (
      client_id,
      lover_id
    ) VALUES (
      (SELECT id FROM client WHERE tgid = ${client_id}),
      (SELECT id FROM client WHERE tgid = ${lover_id})
    );
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
