import express from "express";
import { Singleton } from "../../business/decorators/singletone";
import Logger from "../logger";
import router from "./router";

@Singleton
export default class Server {
  constructor(private port: number) {
    this.port = port;
  }

  public async createServer(): Promise<Error | void> {
    const server = express();

    server.use("/api/wishlist/", router);
    server.use("/", express.static("public"));

    server.listen(this.port || process.env.APP_PORT, () => {
      Logger.log(
        "info",
        `The server has been started at port ${
          this.port || process.env.APP_PORT
        }`
      );
    });
  }
}
