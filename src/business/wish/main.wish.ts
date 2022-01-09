import {
  buyWish,
  createMinWishAccess,
  createWishAccess,
  deleteWishByID,
  getSpendedMoney,
  getWishesByID,
} from "../../modules/database/access/wish.access";
import Parser from "../../modules/parser";
import { ClientID, ClientTGID } from "../client/types.client";
import { WishDto, WishID } from "./types.wish";

export default class Wish {
  constructor(private href: string) {
    this.href = href;
  }

  async create(client_id: ClientTGID): Promise<{id: number}> {
    const result = await createMinWishAccess(client_id, this.href);
    if (result && result.id) return result
  }

  async getWishesByID(client_id: ClientTGID) {
    return await getWishesByID(client_id);
  }

  async deleteWish(id: WishID): Promise<WishID> {
    return await deleteWishByID(id);
  }

  async markWishAsGifted(wish_id: WishID, client_id: ClientID): Promise<WishID> {
    return await buyWish(wish_id, client_id);
  }

  async stats(client_uuid: string): Promise<WishID> {
    return await getSpendedMoney(client_uuid);
  }
}
