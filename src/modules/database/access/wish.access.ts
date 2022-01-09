import Database from "..";
import { ClientID, ClientTGID } from "../../../business/client/types.client";
import { WishDto, WishID } from "../../../business/wish/types.wish";
import { getOneByChatIDAccess } from "./client.access";

export async function createWishAccess(wish: WishDto) {
  return await Database.getInstance().oneOrNone(`

        UPDATE wish
        SET title = '${wish.title}',
            price = '${wish.price}',
            img_url = '${wish.img_url}'
        WHERE href = '${wish.href};
    `);
}

export async function createMinWishAccess(
  client_id: ClientTGID,
  href: string
): Promise<{ id: number }> {
  return await Database.getInstance().oneOrNone(`
        INSERT INTO wish (
            client_id,
            href,
            created_at
        ) VALUES (
            ${(await getOneByChatIDAccess(client_id)).id},
            '${href}',
            current_timestamp
        ) RETURNING id;
    `);
}

export async function getUnmanagedWishes(): Promise<
  Array<{ id: number; href: string; client_id: ClientTGID }>
> {
  return await Database.getInstance().manyOrNone(`
    SELECT id, href, client_id
    FROM wish
    WHERE title IS NULL OR price IS NULL;
  `);
}

export async function getWishesByID(id: ClientTGID): Promise<WishDto[]> {
  return await Database.getInstance().manyOrNone(`
        SELECT *
        FROM wish
        WHERE client_id = (SELECT id FROM client WHERE tgid = '${id}')
        AND bought_at is null;
    `);
}

export async function deleteWishByID(id: WishID): Promise<WishID> {
  return await Database.getInstance().oneOrNone(`
        DELETE FROM wish 
        WHERE id = ${id}
        RETURNING id;
    `);
}

export async function buyWish(
  wish_id: WishID,
  client_id: ClientID
): Promise<WishID> {
  return await Database.getInstance().oneOrNone(`
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

export async function getSpendedMoney(client_uuid: string): Promise<number> {
  return await Database.getInstance().oneOrNone(`
    SELECT sum(w.price) as price 
    FROM wish w
    LEFT JOIN trans t on t.wish_id = w.id 
    GROUP BY t.client_id 
    HAVING t.client_id = (SELECT id FROM client WHERE uuid='${client_uuid}');
    `);
}
