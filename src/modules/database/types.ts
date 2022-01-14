import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"
import { ClientTGID } from "../../business/client/types.client"

export type DBReply = {
    status: boolean,
    err: Error | null
}

export type DbInstance<T> = pgPromise.IDatabase<T, pg.IClient> & T

export type UnmanagedWish = { 
    id: number; 
    href: string; 
    client_id: ClientTGID 
}