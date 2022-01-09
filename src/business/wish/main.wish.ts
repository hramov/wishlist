import {
  buyWish,
  createWishAccess,
  deleteWishByID,
  getSpendedMoney,
  getWishesByID,
} from "../../modules/database/access/wish.access";
import Parser from "../../modules/parser";
import Client from "../client/main.client";
import { ClientDto, ClientID, ClientTGID } from "../client/types.client";
import { WishDto, WishID } from "./types.wish";

export default class Wish {
  constructor(private href: string) {
    this.href = href;
  }

  async create(client_id: ClientTGID): Promise<WishDto> {
    try {
      const result = await new Parser(null).parse(this.href, client_id);
      if (result != null) {
        await createWishAccess(result);
        return result;
      }
    } catch (_err) {
      const err: Error = _err as Error;
      console.log(err.message);
    }
    return null;
  }

  // async getMyWishes(client_id: ClientTGID): Promise<WishDto[]> {
  //   const result = await new Client().getOneByChatID(client_id);
  //   if (result != null && result.id) {
  //     return await getWishesByID(result.id);
  //   }
  //   return null;
  // }

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
