import Database from "..";
import { ClientID, ClientTGID } from "../../../business/client/types.client";
import { Singleton } from "../../../business/decorators/singletone";
import { WishDto, WishID } from "../../../business/wish/types.wish";
import { DbInstance, UnmanagedWish } from "../types";
import ClientAccess from "./client.access";

@Singleton
export default class WishAccess {
  constructor(private readonly db: DbInstance<Database> = Database.getInstance()) {}

  async createWishAccess(wish: WishDto) {
    return await this.db.oneOrNone(`
  
          UPDATE wish
          SET title = '${wish.title}',
              price = '${wish.price}',
              img_url = '${wish.img_url}'
          WHERE href = '${wish.href}';
      `);
  }

  async createMinWishAccess(
    client_id: ClientTGID,
    href: string
  ): Promise<{ id: number }> {
    return await this.db.oneOrNone(`
          INSERT INTO wish (
              client_id,
              href,
              created_at,
              hostname
          ) VALUES (
              ${(await new ClientAccess().getOneByChatIDAccess(client_id)).id},
              '${href}',
              current_timestamp,
              '${new URL(href).hostname}'
          ) RETURNING id;
      `);
  }

  async getUnmanagedWishes(): Promise<
    Array<UnmanagedWish>
  > {
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

  async getWishesByID(id: ClientTGID): Promise<WishDto[]> {
    return await this.db.manyOrNone(`
          SELECT *
          FROM wish
          WHERE client_id = (SELECT id FROM client WHERE tgid = '${id}')
          AND bought_at is null;
      `);
  }

  async deleteWishByID(id: WishID): Promise<WishID> {
    return await this.db.oneOrNone(`
          DELETE FROM wish 
          WHERE id = ${id}
          RETURNING id;
      `);
  }

  async buyWish(wish_id: WishID, client_id: ClientID): Promise<WishID> {
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

  async getSpendedMoney(client_uuid: string): Promise<number> {
    return await this.db.oneOrNone(`
      SELECT sum(w.price) as price 
      FROM wish w
      LEFT JOIN trans t on t.wish_id = w.id 
      GROUP BY t.client_id 
      HAVING t.client_id = (SELECT id FROM client WHERE uuid='${client_uuid}');
      `);
  }

  async isAutoAccess(href: string): Promise<{ auto: number }> {
    return await this.db.oneOrNone(`
      SELECT 1 as auto
      FROM shops
      WHERE title = '${href}'
    `);
}
}
