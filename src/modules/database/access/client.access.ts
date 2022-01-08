import Database from "..";
import {
  ClientDto,
  ClientID,
  ClientTGID,
} from "../../../business/client/types.client";

export async function registerAccess(
  client: ClientDto
): Promise<{ id: ClientID }> {
  return await Database.getInstance().oneOrNone(`
        INSERT INTO client (
            tgid,
            username,
            created_at
        ) VALUES (
            '${client.tgid}',
            '${client.username}',
            current_timestamp
        ) RETURNING id;
    `);
}

export async function getOneByChatIDAccess(id: ClientTGID): Promise<ClientDto> {
  return await Database.getInstance().oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = '${id}';
    `);
}

export async function getLoversByChatIDAccess(
  id: ClientTGID
): Promise<ClientDto[]> {
  return await Database.getInstance().oneOrNone(`
        SELECT * 
        FROM client_lover 
        WHERE client_id = (
          SELECT id from client WHERE tgid = ${id}
        )
    `);
}

export async function bindLoverAccess(client_id: ClientID, lover_id: ClientID) {
  return await Database.getInstance().query(`
    INSERT INTO client_lover (
      client_id,
      lover_id
    ) VALUES (
      (SELECT id FROM client WHERE tgid = ${client_id}),
      (SELECT id FROM client WHERE tgid = ${lover_id})
    );
  `);
}

export async function getUUIDByChatID(client_id: ClientID) {
  return await Database.getInstance().oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
}
