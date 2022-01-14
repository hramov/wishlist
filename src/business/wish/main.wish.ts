import WishAccess from "../../modules/database/access/wish.access";
import { ClientID, ClientTGID } from "../client/types.client";
import { Singleton } from "../decorators/singletone";
import { WishID } from "./types.wish";

@Singleton
export default class Wish {
  constructor(private readonly access = new WishAccess()) {}

  async create(client_id: ClientTGID, href: string): Promise<{ id: number }> {
    const result = await this.access.createMinWishAccess(client_id, href);
    const isAuto = await this.access.isAutoAccess(new URL(href).hostname);
    if (!isAuto || !isAuto.auto) {
      return {
        id: -1,
      };
    }
    if (result && result.id) return result;
  }

  async getWishesByID(client_id: ClientTGID) {
    return await this.access.getWishesByID(client_id);
  }

  async deleteWish(id: WishID): Promise<WishID> {
    return await this.access.deleteWishByID(id);
  }

  async markWishAsGifted(
    wish_id: WishID,
    client_id: ClientID
  ): Promise<WishID> {
    return await this.access.buyWish(wish_id, client_id);
  }

  async stats(client_uuid: string): Promise<WishID> {
    return await this.access.getSpendedMoney(client_uuid);
  }
}
