import TelegramBot from "node-telegram-bot-api";
import Client from "../../business/client/main.client";
import { ClientDto } from "../../business/client/types.client";
import Logger from "../logger";
import { buyWishCb, deleteWishCb, showWishCb } from "./cb_handlers";
import {
  start,
  info,
  createWishDialog,
  getMyWishes,
  createLink,
  createStatLink,
  getMyLovers,
} from "./handlers";

export default class Telegram {
  private instance: TelegramBot = null;

  constructor(private token: string) {
    this.token = token;
  }

  public createBot(): TelegramBot {
    this.instance = new TelegramBot(this.token, { polling: true });
    this.handler();
    return this.instance;
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
        case "\u2728 Создать желание":
          await createWishDialog(this.instance, msg);
          break;
        case "\u{1F4E6} Посмотреть мои желания":
          await getMyWishes(this.instance, msg);
          break;
        case "\u{1F381} Посмотреть, что подарить":
          await getMyLovers(this.instance, msg);
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
          const lover_tgid = msg.text.split(" ")[1];

          if (lover_tgid == msg.chat.id.toString()) {
            await this.instance.sendMessage(
              msg.chat.id,
              `Нельзя добавить самого себя`
            );
            return;
          }
          const lover = await new Client().getOneByChatID(lover_tgid);

          const client: ClientDto = {
            tgid: msg.from.id.toString(),
            username: `${msg.from.first_name} ${msg.from.last_name}`,
          };

          const result = await new Client().bindLover(client, lover_tgid);
          if (result === true) {
            await this.instance.sendMessage(
              msg.chat.id,
              `Вы получили доступ к виш-листу ${lover.username}`
            );
          } else {
            await this.instance.sendMessage(
              msg.chat.id,
              `У вас уже есть доступ к виш-листу ${lover.username}`
            );
          }
        } catch (_err) {
          const err: Error = _err as Error;
          Logger.log("error", err.message);
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
