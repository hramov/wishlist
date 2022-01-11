import { WishDto } from "../../business/wish/types.wish";
import Ozon from "./sites/ozon.site";
import { items } from "./conf/selectors.json";
import { Page } from "puppeteer";
import Logger from "../logger";

export default class Router {
  constructor(private page: Page) {
    this.page = page;
  }

  async route(url: string): Promise<WishDto> {
    const hostname = new URL(url).hostname;
    switch (hostname) {
      case "www.ozon.ru":
        const result = await Ozon(this.page, items.ozon);
        if (result) {
          return {
            href: url,
            ...result,
          };
        }
        break;
      default: {
        Logger.log("warning", `Unsupported shop hostname: ${hostname}`);
        return {
          href: url,
        };
      }
    }
    return null;
  }
}
