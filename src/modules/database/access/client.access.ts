import Database from "..";
import {
  ClientDto,
  ClientID,
  ClientTGID,
} from "../../../business/client/types.client";

export async function registerAccess(client: ClientDto): Promise<ClientDto> {
  return await Database.getInstance().oneOrNone(`
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

export async function getOneByChatIDAccess(id: ClientTGID): Promise<ClientDto> {
  return await Database.getInstance().oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = '${id}';
    `);
}

export async function getIsLoverAccess(client_id: ClientTGID, lover_id: ClientTGID) {
  return await Database.getInstance().oneOrNone(`
    SELECT *
    FROM client_lover
    WHERE client_id = '${client_id}'
    AND lover_id = '${lover_id}'
  `)
}

export async function getLoversByChatIDAccess(
  tgid: ClientTGID
): Promise<ClientDto[]> {
  return await Database.getInstance().manyOrNone(`
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

export async function bindLoverAccess(client_id: ClientTGID, lover_id: ClientTGID): Promise<{result: boolean}> {
  return await Database.getInstance().oneOrNone(`
    SELECT * FROM bind_lover('${client_id}', '${lover_id}') as result;
  `);
}

export async function getUUIDByChatID(client_id: ClientID) {
  return await Database.getInstance().oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
}
