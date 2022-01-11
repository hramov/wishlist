import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import Logger from "../logger";

export default class Database {
  private static instance: pgPromise.IDatabase<Database, pg.IClient> & Database;

  public static getInstance(): pgPromise.IDatabase<Database, pg.IClient> &
    Database {
    if (!this.instance) {
      try {
        const pgp = pgPromise({});
        this.instance = pgp(
          `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        );
        Logger.log("info", "Successfully connected to DB");
      } catch (err) {
        Logger.log("error", "DB connection error");
        Logger.log("error", err as string);
        process.exit(1);
      }
    }
    return this.instance;
  }
}
