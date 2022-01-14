import Database from "..";
import {
  ClientDto,
  ClientID,
  ClientTGID,
} from "../../../business/client/types.client";
import { DbInstance } from "../types";

export default class ClientAccess {
  constructor(
    private readonly db: DbInstance<Database> = Database.getInstance()
  ) {}

  async registerAccess(client: ClientDto): Promise<ClientDto> {
    return await this.db.oneOrNone(`
        INSERT INTO client (
            tgid,
            username,
            created_at
        ) VALUES (
            '${client.tgid}',
            '${client.username}',
            current_timestamp
        ) RETURNING id, tgid, username;
    `);
  }

  async getOneByChatIDAccess(id: ClientTGID): Promise<ClientDto> {
    return await this.db.oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = '${id}';
    `);
  }

  async getIsLoverAccess(client_id: ClientTGID, lover_id: ClientTGID) {
    return await this.db.oneOrNone(`
    SELECT *
    FROM client_lover
    WHERE client_id = '${client_id}'
    AND lover_id = '${lover_id}'
  `);
  }

  async getLoversByChatIDAccess(tgid: ClientTGID): Promise<ClientDto[]> {
    return await this.db.manyOrNone(`
        SELECT c.id, c.tgid, c.username, c.uuid
        FROM client_lover cl
        LEFT JOIN client c
        ON c.id = cl.lover_id
        WHERE client_id = (
          SELECT id 
          FROM client 
          WHERE tgid = '${tgid}'
        )
    `);
  }

  async bindLoverAccess(
    client_id: ClientTGID,
    lover_id: ClientTGID
  ): Promise<{ result: boolean }> {
    return await this.db.oneOrNone(`
    SELECT * FROM bind_lover('${client_id}', '${lover_id}') as result;
  `);
  }

  async getUUIDByChatID(client_id: ClientID) {
    return await this.db.oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
  }
}
