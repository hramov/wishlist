import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import Database from ".";

export type DBReply = {
    status: boolean,
    err: Error | null
}

export interface IDB {
    connect(): Promise<void>;
    getInstance(): pgPromise.IDatabase<Database, pg.IClient> &
    Database
}