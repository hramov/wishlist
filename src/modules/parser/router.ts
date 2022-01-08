import { WishDto } from "../../business/wish/types.wish";
import Ozon from "./sites/ozon.site";
import { items } from "./conf/selectors.json";
import { Page } from "puppeteer";

export default class Router {
  constructor(private page: Page) {
    this.page = page;
  }

  async route(url: string): Promise<WishDto> {
    switch (new URL(url).hostname) {
      case "www.ozon.ru":
        const result = await Ozon(this.page, items.ozon);
        if (result) {
          return {
            href: url,
            ...result,
          };
        }
    }
    return null;
  }
}
