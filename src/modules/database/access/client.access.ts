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
            lover_tgid,
            username,
            created_at
        ) VALUES (
            '${client.tgid}',
            '${client.lover_tgid || "NULL"}',
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

export async function getLoverByChatIDAccess(
  id: ClientTGID
): Promise<ClientDto> {
  return await Database.getInstance().oneOrNone(`
        SELECT * 
        FROM client 
        WHERE tgid = (SELECT lover_tgid 
          FROM client
          WHERE tgid = '${id}');
    `);
}

export async function bindLoverAccess(client_id: ClientID, lover_id: ClientID) {
  return await Database.getInstance().query(`
    UPDATE client
    SET lover_tgid = '${lover_id}'
    WHERE tgid = '${client_id}';

    UPDATE client
    SET lover_tgid = '${client_id}'
    WHERE tgid = '${lover_id}'
    RETURNING lover_tgid;
  `);
}

export async function getUUIDByChatID(client_id: ClientID) {
  return await Database.getInstance().oneOrNone(`
    SELECT uuid
    FROM client
    WHERE tgid = '${client_id}';
  `);
}
