import Server from "./modules/server";
import Telegram from "./modules/telegram";

import dotenv from "dotenv";
import Parser from "./modules/parser";
dotenv.config();

class Main {
  public async start(): Promise<Error> {
    const server = new Server(Number(process.env.APP_PORT) || 5000);
    const err = await server.createServer();
    if (err) {
      return err;
    }

    const bot = new Telegram(process.env.TOKEN);
    const instance = bot.createBot();

    const parser = new Parser({
      // Параметры, которые передаются на вход puppeteer при запуске браузера
      args: [
        "--unhandled-rejections=strict",
        "--disable-notifications",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
      ],
      headless: true, // Графический интерфейс (true - отключен, false - включен).
      // Запуск с графическим режимом только от имени пользователя
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    });

    await parser.create();
    await parser.demon(instance);
  }
}

const main = new Main();
main.start();
