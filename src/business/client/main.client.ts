import {
  bindLoverAccess,
  getLoversByChatIDAccess,
  getOneByChatIDAccess,
  registerAccess,
} from "../../modules/database/access/client.access";
import Logger from "../../modules/logger";
import { isString } from "../validation/validators";
import { ClientDto, ClientID, ClientTGID } from "./types.client";

export default class Client {
  async register(client: ClientDto): Promise<ClientDto> {
    return await registerAccess(client);
  }

  async getOneByChatID(@isString id: ClientTGID): Promise<ClientDto> {
    return await getOneByChatIDAccess(id);
  }

  async getLoversByChatID(id: ClientTGID): Promise<ClientDto[]> {
    return await getLoversByChatIDAccess(id);
  }

  async createLink(@isString tgid: ClientID): Promise<string> {
    return `
Присоединяйся ко мне в Wish List Exchange \u{1F64C} (перейди по ссылке и нажми кнопку START):
https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
  }

  async bindLover(client: ClientDto, lover_id: ClientTGID): Promise<boolean> {
    const candidate = await getOneByChatIDAccess(client.tgid);
    const lover = await getOneByChatIDAccess(lover_id);

    if (candidate == null || candidate.id == null) {
      client = await registerAccess(client);
      Logger.log("info", `User ${client.username} successfully registered`)
    }

    if (lover == null || lover.id == null) {
      return false;
    }

    return (await bindLoverAccess(client.tgid, lover_id)).result;
  }
}
