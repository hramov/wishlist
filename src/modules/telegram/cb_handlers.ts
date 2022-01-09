import TelegramBot from "node-telegram-bot-api";
import Wish from "../../business/wish/main.wish";
import { deleteWishByID } from "../database/access/wish.access";

export async function deleteWishCb(
  instance: TelegramBot,
  cb: TelegramBot.CallbackQuery
) {
  await instance.answerCallbackQuery(cb.id);
  const result = await deleteWishByID(Number(cb.data.split(" ")[1]));
  if (result != null) {
    await instance.deleteMessage(cb.from.id, cb.message.message_id.toString());
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
  await instance.answerCallbackQuery(cb.id);
  const result = await new Wish(null).getWishesByID(
    cb.data.split(" ")[1]
  );
  if (result != null && result.length > 0) {
    result.forEach(async (wish) => {
      await instance.sendMessage(
        cb.from.id,
        `
${wish.title}
${wish.price}
${wish.href}
        `
      );
    });
  } else {
    await instance.sendMessage(cb.from.id, "Виш-лист пользователя пуст");
  }
}
