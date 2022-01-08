import TelegramBot from "node-telegram-bot-api";
import Client from "../../business/client/main.client";
import { ClientDto } from "../../business/client/types.client";
import { buyWishCb, deleteWishCb, showWishCb } from "./cb_handlers";
import {
  start,
  info,
  createWishDialog,
  getMyWishes,
  getMyLoverWishes,
  createLink,
  buyWishDialog,
  createStatLink,
} from "./handlers";

export default class Telegram {
  private instance: TelegramBot = null;

  constructor(private token: string) {
    this.token = token;
  }

  public createBot(): void {
    this.instance = new TelegramBot(this.token, { polling: true });
    this.handler();
  }

  private handler() {
    this.instance.on("message", async (msg) => {
      switch (msg.text) {
        case "/start":
          await start(this.instance, msg);
          return;
        case "/info":
          info(this.instance, msg);
          break;
        case "/bind ":
          console.log("Bind");
          break;
        case "\u2728 Создать желание":
          await createWishDialog(this.instance, msg);
          break;
        case "\u2714 Отметить подаренное":
          await buyWishDialog(this.instance, msg);
          break;
        case "\u{1F4E6} Посмотреть мои желания":
          await getMyWishes(this.instance, msg);
          break;
        case "\u{1F381} Посмотреть, что подарить":
          await getMyLoverWishes(this.instance, msg);
          break;
        case "\u270C Создать приглашение":
          await createLink(this.instance, msg);
          break;
        case "\u270F Статистика":
          await createStatLink(this.instance, msg);
          break;
      }

      if (msg.text.startsWith("/start ")) {
        try {
          const lover_tgid = Number(msg.text.split(" ")[1]);
          const client: ClientDto = {
            tgid: msg.from.id,
            username: `${msg.from.first_name} ${msg.from.last_name}`,
          };
          const result = await new Client().bindLover(client, lover_tgid);
          if (typeof result == "string") {
            await this.instance.sendMessage(msg.chat.id, result);
          } else {
            await this.instance.sendMessage(
              msg.chat.id,
              `Вы получили доступ к виш-листу ${
                (
                  await new Client().getOneByChatID(lover_tgid)
                ).username
              }`
            );
          }
        } catch (err) {
          console.log(err);
          await this.instance.sendMessage(msg.chat.id, "Ошибка");
        }
      }
    });

    this.instance.on("callback_query", async (cb) => {
      const command = cb.data.split(" ")[0];

      switch (command) {
        case "delete":
          await deleteWishCb(this.instance, cb);
          break;
        case "buy":
          await buyWishCb(this.instance, cb);
          break;
        case "show":
          await showWishCb(this.instance, cb);
          break;
      }
    });
  }
}
