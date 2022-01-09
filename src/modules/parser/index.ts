import puppeteer, { Browser } from "puppeteer";
import { WishDto } from "../../business/wish/types.wish";
import Router from "./router";
import { userAgents } from "./conf/default.json";
import { ClientTGID } from "../../business/client/types.client";
import {
  createWishAccess,
  getUnmanagedWishes,
} from "../database/access/wish.access";
import Logger from "../logger";
import TelegramBot from "node-telegram-bot-api";

export default class Parser {
  private browser: Browser = null;
  private isStarted: boolean = false;
  private pages: number = 0;

  private static exists: boolean = false;
  private static instance: Parser = null;

  constructor(private options: any) {
    if (!Parser.exists) {
      this.options = options;
      Parser.exists = true;
      Parser.instance = this;
    }
    return Parser.instance;
  }

  async create(): Promise<Browser> {
    if (!this.isStarted) {
      this.browser = await puppeteer.launch(this.options);
      this.isStarted = true;
    }
    return this.browser;
  }

  async parse(url: string, client_id: ClientTGID): Promise<WishDto> {
    if (this.pages < Number(process.env.MAX_PAGES || 3)) {
      Logger.log("info", `Начинаю обработку запроса: ${url}`);
      const page = await this.browser.newPage();
      this.pages++;
      try {
        page.setDefaultNavigationTimeout(15000);
        await page.setUserAgent(await this.getUserAgent());

        await page.setViewport({
          width: 1920,
          height: 1080,
        });
        await page.goto(url);
        const router = new Router(page);
        const result = await router.route(url);
        await page.close();
        this.pages--;
        if (result) {
          return {
            client_id,
            ...result,
          };
        }
      } catch (_err) {
        const err: Error = _err as Error;
        await page.close();
        this.pages--;
        Logger.log("error", `Ошибка обработки запроса: ${err.message}`);
      }
    } else {
      return null;
    }
    return null;
  }

  async getUserAgent() {
    return userAgents[Math.ceil(Math.random() * (userAgents.length - 1))];
  }

  async destroy() {
    await this.browser.close();
    this.isStarted = false;
    Parser.exists = false;
    Parser.instance = null;
  }

  async demon(instance: TelegramBot) {
    let isGo = true;
    setInterval(async () => {
      if (isGo) {
        const hrefs = await getUnmanagedWishes();

        for (let i = 0; i < hrefs.length; i++) {
          try {
            isGo = false;
            const wish = await this.parse(hrefs[i].href, hrefs[i].client_id);
            await createWishAccess(wish);
            Logger.log("info", `Успешно обработал запрос: ${hrefs[i].href}`);
            await instance.sendMessage(
              hrefs[i].client_id,
              `Успешно обработал запрос: ${hrefs[i].href}`
            );
          } catch (_err) {
            const err: Error = _err as Error;
            Logger.log("error", `Ошибка при обработке запроса: ${err.message}`);
          }
          await this.timeout(15000);
          isGo = true;
        }
      }
    }, 10000);
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
