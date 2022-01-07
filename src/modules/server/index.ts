import express from "express";
import Database from "../database";
import router from "./router";

export default class Server {
  constructor(private port: number) {
    this.port = port;
  }

  public async createServer(): Promise<Error | void> {
    const server = express();
    const db = await new Database().connect();
    if (!db.status) {
        return db.err
    }

    server.use("/api/wishlist/", router);
    server.use("/", express.static('public'))

    server.listen(this.port || process.env.APP_PORT, () => {
      console.log(
        `The server has been started at port ${this.port || process.env.APP_PORT}`
      );
    });
  }
}
