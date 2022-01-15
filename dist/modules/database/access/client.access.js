"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const performance_1 = require("../../../business/decorators/performance");
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
__decorate([
    performance_1.Timing,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClientAccess.prototype, "bindLoverAccess", null);
exports.default = ClientAccess;
