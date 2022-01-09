"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpendedMoney = exports.buyWish = exports.deleteWishByID = exports.getWishesByID = exports.getUnmanagedWishes = exports.createMinWishAccess = exports.createWishAccess = void 0;
const __1 = __importDefault(require(".."));
const client_access_1 = require("./client.access");
async function createWishAccess(wish) {
    return await __1.default.getInstance().oneOrNone(`

        UPDATE wish
        SET title = '${wish.title}',
            price = '${wish.price}',
            img_url = '${wish.img_url}'
        WHERE href = '${wish.href}';
    `);
}
exports.createWishAccess = createWishAccess;
async function createMinWishAccess(client_id, href) {
    return await __1.default.getInstance().oneOrNone(`
        INSERT INTO wish (
            client_id,
            href,
            created_at
        ) VALUES (
            ${(await (0, client_access_1.getOneByChatIDAccess)(client_id)).id},
            '${href}',
            current_timestamp
        ) RETURNING id;
    `);
}
exports.createMinWishAccess = createMinWishAccess;
async function getUnmanagedWishes() {
    return await __1.default.getInstance().manyOrNone(`
    SELECT id, href, client_id
    FROM wish
    WHERE title IS NULL OR price IS NULL;
  `);
}
exports.getUnmanagedWishes = getUnmanagedWishes;
async function getWishesByID(id) {
    return await __1.default.getInstance().manyOrNone(`
        SELECT *
        FROM wish
        WHERE client_id = (SELECT id FROM client WHERE tgid = '${id}')
        AND bought_at is null;
    `);
}
exports.getWishesByID = getWishesByID;
async function deleteWishByID(id) {
    return await __1.default.getInstance().oneOrNone(`
        DELETE FROM wish 
        WHERE id = ${id}
        RETURNING id;
    `);
}
exports.deleteWishByID = deleteWishByID;
async function buyWish(wish_id, client_id) {
    return await __1.default.getInstance().oneOrNone(`
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
exports.buyWish = buyWish;
async function getSpendedMoney(client_uuid) {
    return await __1.default.getInstance().oneOrNone(`
    SELECT sum(w.price) as price 
    FROM wish w
    LEFT JOIN trans t on t.wish_id = w.id 
    GROUP BY t.client_id 
    HAVING t.client_id = (SELECT id FROM client WHERE uuid='${client_uuid}');
    `);
}
exports.getSpendedMoney = getSpendedMoney;
