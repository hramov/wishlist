import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import * as fs from "fs";

import { DBReply } from "./types";

export default class Database {
  private static exists: boolean = false;
  private static instance: Database = null;
  private static isInit: boolean = false;

  static pgp = pgPromise({});
  static conn: pgPromise.IDatabase<Database, pg.IClient> & Database;

  constructor() {
    if (Database.exists) return Database.instance;
    Database.instance = this;
    Database.exists = true;
  }

  public async connect(): Promise<DBReply> {
    Database.conn = Database.pgp(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    try {
      // await Database.init();
      return {
        status: true,
        err: null,
      };
    } catch (_err: unknown) {
      const err: Error = _err as Error;
      return {
        status: false,
        err: err,
      };
    }
  }

  public static getInstance(): pgPromise.IDatabase<Database, pg.IClient> &
    Database {
    return Database.conn;
  }

  private static async init(): Promise<DBReply> {
    const exists = await Database.conn.oneOrNone(
      Database.readSql("check_init.sql")
    );
    console.log(exists)
    if (!exists) {
      if (Database.exists) {
        try {
          const initSQL = Database.readSql("hand_init.sql");
          console.log(initSQL);
          await Database.conn.query(initSQL);
        } catch (_err) {
          console.log(_err);
          const err: Error = _err as Error;
          return {
            status: false,
            err: err,
          };
        }
      } else {
        return {
          status: false,
          err: {
            name: "Database error",
            message: "No database connected",
          },
        };
      }
    }
    Database.isInit = true;
  }

  private static readSql(filePath: string): string {
    return fs.readFileSync(`static/sql/${filePath}`).toString();
  }
}
