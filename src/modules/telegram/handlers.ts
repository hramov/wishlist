import TelegramBot from "node-telegram-bot-api";
import Client from "../../business/client/main.client";
import Wish from "../../business/wish/main.wish";
import { startKeyboard } from "./keyboard";
import { getUUIDByChatID } from "../database/access/client.access";
import { deleteWishByID } from "../database/access/wish.access";

export async function info(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<Error | null> {
  await instance.sendMessage(msg.from.id, "Hello");
  return null;
}

export async function start(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<Error | null> {
  const candidate = await new Client().getOneByChatID(msg.from.id);
  if (!candidate) {
    const { id } = await new Client().register({
      tgid: msg.from.id,
      username: msg.from.username,
    });
    if (id) {
      await instance.sendMessage(
        msg.from.id,
        `Вы были успешно зарегистрированы! Ваш Chat ID: ${msg.from.id}`
      );
    }
    console.log(`Пользователь ${id} успешно зарегистрировался`);
  } else {
    await instance.sendMessage(
      msg.from.id,
      `Вы уже зарегистрированы! Ваш Chat ID: ${msg.from.id}`
    );
  }
  await instance.sendMessage(
    msg.chat.id,
    "Выберите действие ниже",
    startKeyboard
  );
  return null;
}

export async function createWish(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<Error | null> {
  await instance.sendMessage(msg.chat.id, "Начинаю обработку...");
  const result = await new Wish(new URL(msg.text).toString()).create(
    msg.chat.id
  );
  if (result != null) {
    await instance.sendMessage(
      msg.chat.id,
      `
Успешно обработал: 
${result.title} 
Стоимость: ${result.price} руб.`
    );
  } else {
    await instance.sendMessage(msg.chat.id, "Ошибка при обработке...")
  }
  console.log(result);
  return null;
}

export async function createWishDialog(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<string> {
  await instance.sendMessage(msg.chat.id, "Введите ссылку на товар");
  instance.once("message", async (msg) => {
    if (msg.text.startsWith("http")) {
      await createWish(instance, msg);
    } else {
      await instance.sendMessage(msg.chat.id, "Неверный формат ссылки!");
    }
  });
  return null;
}

export async function getMyWishes(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const result = await new Wish(null).getMyWishes(msg.chat.id);
  console.log(result);
  if (result != null && result.length > 0) {
    result.forEach(async (item) => {
      instance.sendMessage(
        msg.chat.id,
        `
${item.title}
Цена: ${item.price} рублей
${item.href}
        `,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "\u2705 Подарили",
                  callback_data: `buy ${item.id.toString()}`,
                },
                {
                  text: "\u2716 Удалить",
                  callback_data: `delete ${item.id.toString()}`,
                },
              ],
            ],
          },
        }
      );
    });
    return;
  }
  await instance.sendMessage(msg.chat.id, "Нет добавленных желаний");
}

export async function getMyLoverWishes(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const result = await new Wish(null).getMyLoverWishes(msg.chat.id);
  console.log(result);
  if (result != null && result.length > 0) {
    result.forEach(async (item) => {
      await instance.sendMessage(
        msg.chat.id,
        `
${item.title}
Цена: ${item.price} рублей
${item.href}
        `
      );
    });
    return;
  }
  await instance.sendMessage(msg.chat.id, "Нечего дарить :-(");
}

export async function deleteWish(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const result = await new Wish(null).deleteWish(Number(msg.text));
  if (result != null) {
    await instance.sendMessage(
      msg.chat.id,
      `Желание с ID ${Number(msg.text)} успешно удалено`
    );
    return;
  }
  await instance.sendMessage(msg.chat.id, `Ошибка во время удаления желания`);
}

export async function createLink(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const link = await new Client().createLink(msg.chat.id);
  await instance.sendMessage(msg.chat.id, link);
  return;
}

export async function buyWishHandler(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  try {
    const result = new Wish(null).markWishAsGifted(
      Number(msg.text),
      msg.chat.id
    );
    if (result) {
      await instance.sendMessage(msg.chat.id, "Успешно отмечено");
      return;
    }
  } catch (err) {
    await instance.sendMessage(msg.chat.id, "Произошла ошибка");
  }
}

export async function buyWishDialog(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  await instance.sendMessage(msg.chat.id, "Введите ID желания");
  instance.once("message", async (msg) => {
    if (!isNaN(Number(msg.text))) {
      await buyWishHandler(instance, msg);
    }
  });
}

export async function createStatLink(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const uuid = await getUUIDByChatID(msg.chat.id);
  if (uuid != null && uuid.uuid) {
    console.log(uuid.uuid);
    const result = `${process.env.PROTOCOL || "http"}://${
      process.env.APP_HOST || "hramovdev.ru"
    }:${process.env.APP_PORT}/api/wishlist/statistics/${uuid.uuid}`;
    console.log(result);
    await instance.sendMessage(
      msg.chat.id,
      `
Ваша ссылка на статистику:
${result}
  `
    );
    return;
  }
  await instance.sendMessage(
    msg.chat.id,
    `
Проблемы с генерацией ссылки...
`
  );
}
