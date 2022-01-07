import {
  bindLoverAccess,
  getLoverByChatIDAccess,
  getOneByChatIDAccess,
  registerAccess,
} from "../../modules/database/access/client.access";
import { IClient } from "./interface.client";
import { ClientDto, ClientID, ClientTGID } from "./types.client";

export default class Client implements IClient {
  async register(client: ClientDto): Promise<{ id: ClientID }> {
    return await registerAccess(client);
  }

  getOne(id: ClientID): ClientDto {
    return null;
  }

  async getOneByChatID(id: ClientTGID): Promise<ClientDto> {
    return await getOneByChatIDAccess(id);
  }

  async getLoverByChatID(id: ClientTGID): Promise<ClientDto> {
    return await getLoverByChatIDAccess(id);
  }

  delete(id: ClientID): ClientID {
    return null;
  }

  getLover(id: ClientID): ClientDto {
    return null;
  }

  async createLink(tgid: ClientID): Promise<string> {
    return `https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
  }

  async bindLover(client_id: ClientID, lover_id: ClientID) {
    const client = await getOneByChatIDAccess(client_id);
    if (client == null) {
      await registerAccess({
        tgid: client_id,
        username: "",
      });
    }
    const lover = await getOneByChatIDAccess(lover_id);
    if (client && lover) return await bindLoverAccess(client_id, lover_id);
    return null;
  }
}
