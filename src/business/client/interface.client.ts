import { ClientDto, ClientID, ClientTGID } from "./types.client";

export interface IClient {
  register(client: ClientDto): Promise<{id: ClientID}>;
  getOne(id: ClientID): ClientDto;
  delete(id: ClientID): ClientID;
  getLover(id: ClientID): ClientDto;
  getOneByChatID(id: ClientTGID): Promise<ClientDto>;
}
