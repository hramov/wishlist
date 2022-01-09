import {
  bindLoverAccess,
  getLoversByChatIDAccess,
  getOneByChatIDAccess,
  registerAccess,
} from "../../modules/database/access/client.access";
import { ClientDto, ClientID, ClientTGID } from "./types.client";

export default class Client {
  async register(client: ClientDto): Promise<ClientDto> {
    return await registerAccess(client);
  }

  getOne(id: ClientID): ClientDto {
    return null;
  }

  async getOneByChatID(id: ClientTGID): Promise<ClientDto> {
    return await getOneByChatIDAccess(id);
  }

  async getLoversByChatID(id: ClientTGID): Promise<ClientDto[]> {
    return await getLoversByChatIDAccess(id);
  }

  delete(id: ClientID): ClientID {
    return null;
  }

  getLover(id: ClientID): ClientDto {
    return null;
  }

  async createLink(tgid: ClientID): Promise<string> {
    return `
Присоединяйся ко мне в Wish List Exchange \u{1F64C}:
https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
  }

  async bindLover(client: ClientDto, lover_id: ClientTGID): Promise<boolean> {
    const candidate = await getOneByChatIDAccess(client.tgid);
    if (candidate == null || candidate.id == null) {
      client = await registerAccess(client);
    }
    return (await bindLoverAccess(client.tgid, lover_id)).result;
  }
}
