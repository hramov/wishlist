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

const singletone_1 = require("../../../business/decorators/singletone");
const client_access_1 = __importDefault(require("./client.access"));
let WishAccess = class WishAccess {
    constructor(db = __1.default.getInstance()) {
        this.db = db;
    }
    async createWishAccess(wish) {
        return await this.db.oneOrNone(`
          UPDATE wish
          SET title = '${wish.title}',
              price = '${wish.price}',
              img_url = '${wish.img_url}'
          WHERE href = '${wish.href}';
      `);
    }
    async createMinWishAccess(client_id, href) {
        return await this.db.oneOrNone(`
          INSERT INTO wish (
              client_id,
              href,
              created_at,
              hostname
          ) VALUES (
              ${(await new client_access_1.default().getOneByChatIDAccess(client_id)).id},
              '${href}',
              current_timestamp,
              '${new URL(href).hostname}'
          ) RETURNING id;
      `);
    }
    async getUnmanagedWishes() {
        return await this.db.manyOrNone(`
      SELECT w.id as id, w.href as href, c.tgid as client_id
      FROM wish w
      INNER JOIN client c
      ON c.id = w.client_id
      INNER JOIN shops s
      ON w.hostname = s.title
      WHERE w.title IS NULL OR w.price IS NULL;
    `);
    }
    async getWishesByID(id) {
        return await this.db.manyOrNone(`
          SELECT *
          FROM wish
          WHERE client_id = (SELECT id FROM client WHERE tgid = '${id}')
          AND bought_at is null;
      `);
    }
    async deleteWishByID(id) {
        return await this.db.oneOrNone(`
          DELETE FROM wish 
          WHERE id = ${id}
          RETURNING id;
      `);
    }
    async buyWish(wish_id, client_id) {
        return await this.db.oneOrNone(`
            UPDATE wish
            SET bought_at = current_timestamp,
                is_given = true
            WHERE id = ${wish_id};
              
            INSERT INTO trans (
                client_id,
                wish_id
              ) VALUES (
                  (SELECT lover_id
                  FROM client_lover
                  WHERE client_id = (SELECT id FROM client WHERE tgid = '${client_id}')
                  ),
                  '${wish_id}'
              )
            RETURNING trans.wish_id;
        `);
    }
    async getSpendedMoney(client_uuid) {
        return await this.db.oneOrNone(`
      SELECT sum(w.price) as price 
      FROM wish w
      LEFT JOIN trans t on t.wish_id = w.id 
      GROUP BY t.client_id 
      HAVING t.client_id = (SELECT id FROM client WHERE uuid='${client_uuid}');
      `);
    }
    async isAutoAccess(href) {
        return await this.db.oneOrNone(`
      SELECT 1 as auto
      FROM shops
      WHERE title = '${href}'
    `);
    }
};
WishAccess = __decorate([
    singletone_1.Singleton,
    __metadata("design:paramtypes", [Object])
], WishAccess);
exports.default = WishAccess;
