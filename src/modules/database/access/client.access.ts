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
  return await Database.getInstance().query(`
    SELECT lover_id
    FROM client_lover
    WHERE client_id = '${client_id}
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

export async function bindLoverAccess(client_id: ClientID, lover_id: ClientID) {
  return await Database.getInstance().query(`
    INSERT INTO client_lover (
      client_id,
      lover_id
    ) VALUES (
      (SELECT id FROM client WHERE tgid = '${client_id}'),
      (SELECT id FROM client WHERE tgid = '${lover_id}')
    );

    INSERT INTO client_lover (
      client_id,
      lover_id
    ) VALUES (
      (SELECT id FROM client WHERE tgid = '${lover_id}'),
      (SELECT id FROM client WHERE tgid = '${client_id}')
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
