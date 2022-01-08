"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUIDByChatID = exports.bindLoverAccess = exports.getLoversByChatIDAccess = exports.getIsLoverAccess = exports.getOneByChatIDAccess = exports.registerAccess = void 0;
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
        ) RETURNING id, tgid, username;
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
async function getIsLoverAccess(client_id, lover_id) {
    return await __1.default.getInstance().query(`
    SELECT lover_id
    FROM client_lover
    WHERE client_id = '${client_id}
  `);
}
exports.getIsLoverAccess = getIsLoverAccess;
async function getLoversByChatIDAccess(tgid) {
    return await __1.default.getInstance().manyOrNone(`
        SELECT c.id, c.tgid, c.username, c.uuid
        FROM client_lover cl
        LEFT JOIN client c
        ON c.id = cl.lover_id
        WHERE client_id = (
          SELECT id 
          FROM client 
          WHERE tgid = '${tgid}'
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
      (SELECT id FROM client WHERE tgid = '${client_id}'),
      (SELECT id FROM client WHERE tgid = '${lover_id}')
    );

    INSERT INTO client_lover (
      client_id,
      lover_id
    ) VALUES (
      (SELECT id FROM client WHERE tgid = '${lover_id}'),
      (SELECT id FROM client WHERE tgid = '${client_id}')
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
