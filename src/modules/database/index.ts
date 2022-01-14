import pgPromise from "pg-promise";
import { Singleton } from "../../business/decorators/singletone";
import Logger from "../logger";
import WishAccess from "./access/wish.access";
import { DbInstance } from "./types";

@Singleton
export default class Database {
  private static instance: DbInstance<Database>;

  public static getInstance(): DbInstance<Database> {
    if (!this.instance) {
      try {
        const pgp = pgPromise({});
        this.instance = pgp(
          `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        );
        new WishAccess(this.instance);
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
