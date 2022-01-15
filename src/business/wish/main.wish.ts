import WishAccess from "../../modules/database/access/wish.access";
import Logger from "../../modules/logger";
import { ClientID, ClientTGID } from "../client/types.client";
import { Singleton } from "../decorators/singletone";
import { WishDto, WishID } from "./types.wish";

@Singleton
export default class Wish {
  constructor(private readonly access = new WishAccess()) {}

  async create(
    client_id: ClientTGID,
    href: string
  ): Promise<{ id: number; isAuto: boolean }> {
    const result = await this.access.createMinWishAccess(client_id, href);
    if (result && result.id) {
      Logger.log(
        "info",
        `Wish with id ${result.id} successfully added to database`
      );
      const isAuto = await this.access.isAutoAccess(new URL(href).hostname);

      if (!isAuto || !isAuto.auto) {
        return {
          ...result,
          isAuto: false,
        };
      }
      return {
        ...result,
        isAuto: true,
      };
    }
  }

  async getWishesByID(client_id: ClientTGID) {
    return await this.access.getWishesByID(client_id);
  }

  async getWishByID(wish_id: number): Promise<WishDto> {
    return await this.access.getWishByID(wish_id);
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
