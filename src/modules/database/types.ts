import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"
import Database from "."

export type DBReply = {
    status: boolean,
    err: Error | null
}

export type DbInstance<T> = pgPromise.IDatabase<T, pg.IClient> & T