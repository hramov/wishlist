import TelegramBot from "node-telegram-bot-api";
import { ValidationError } from "../../business/validation/error";
import Wish from "../../business/wish/main.wish";
import {
  createWishAccess,
  deleteWishByID,
} from "../database/access/wish.access";
import Logger from "../logger";

export async function deleteWishCb(
  instance: TelegramBot,
  cb: TelegramBot.CallbackQuery
) {
  await instance.answerCallbackQuery(cb.id);
  const result = await deleteWishByID(Number(cb.data.split(" ")[1]));
  if (result != null) {
    await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
    await instance.sendMessage(cb.from.id, `Желание успешно удалено`);
    return;
  }
  await instance.sendMessage(cb.from.id, `Ошибка при удалении желания!`);
}

export async function buyWishCb(
  instance: TelegramBot,
  cb: TelegramBot.CallbackQuery
) {
  await instance.answerCallbackQuery(cb.id);
  const result = await new Wish(null).markWishAsGifted(
    Number(cb.data.split(" ")[1]),
    cb.from.id
  );
  if (result != null) {
    await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
    await instance.sendMessage(cb.from.id, `Желание успешно получено!`);
    return;
  }
  await instance.sendMessage(cb.from.id, `Ошибка при получении желания!`);
}

export async function showWishCb(
  instance: TelegramBot,
  cb: TelegramBot.CallbackQuery
) {
  const result = await new Wish(null).getWishesByID(cb.data.split(" ")[1]);
  await instance.answerCallbackQuery(cb.id);
  if (result != null && result.length > 0) {
    result.forEach(async (wish) => {
      await instance.sendMessage(
        cb.from.id,
        `
${wish.title || `Название: (еще нет данных)`}
Цена: ${wish.price || "(еще нет данных)"} рублей
${wish.href}
        `
      );
    });
  } else {
    await instance.sendMessage(cb.from.id, "Виш-лист пользователя пуст");
  }
}

export async function handParseCb(
  instance: TelegramBot,
  cb: TelegramBot.CallbackQuery
) {
  const result = {
    href: cb.data.split(" ")[1].toString(),
    title: "",
    price: 0,
  };

  await instance.answerCallbackQuery(cb.id);
  await instance.sendMessage(cb.from.id, `Введите название:`);
  instance.once("message", async (msg: TelegramBot.Message) => {
    result.title = msg.text.toString();
    await instance.sendMessage(cb.from.id, `Введите цену:`);
    instance.once("message", async (msg: TelegramBot.Message) => {
      try {
        result.price = parseInt(msg.text);
        if (Number.isNaN(result.price)) {
          throw new ValidationError("result.price is NaN");
        } 
        await createWishAccess(result);
        await instance.sendMessage(
          cb.from.id,
          `Успешно добавлено желание ${result.href}`
        );
      } catch (_err) {
        const err: Error = _err as Error;
        Logger.log("error", err.message);
        await instance.sendMessage(cb.from.id, `Ошибка при обработке желания!`);
      }
    });
  });
}
