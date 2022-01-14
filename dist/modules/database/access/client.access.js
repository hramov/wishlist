"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
class ClientAccess {
    constructor(db = __1.default.getInstance()) {
        this.db = db;
    }
    async registerAccess(client) {
        return await this.db.oneOrNone(`
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
    async getOneByChatIDAccess(id) {
        return await this.db.oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = '${id}';
    `);
    }
    async getIsLoverAccess(client_id, lover_id) {
        return await this.db.oneOrNone(`
    SELECT *
    FROM client_lover
    WHERE client_id = '${client_id}'
    AND lover_id = '${lover_id}'
  `);
    }
    async getLoversByChatIDAccess(tgid) {
        return await this.db.manyOrNone(`
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
    async bindLoverAccess(client_id, lover_id) {
        return await this.db.oneOrNone(`
    SELECT * FROM bind_lover('${client_id}', '${lover_id}') as result;
  `);
    }
    async getUUIDByChatID(client_id) {
        return await this.db.oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
    }
}
exports.default = ClientAccess;
