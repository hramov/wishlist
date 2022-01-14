import TelegramBot from "node-telegram-bot-api";
import Client from "../../business/client/main.client";
import Wish from "../../business/wish/main.wish";
import { startKeyboard } from "./keyboard";
import ClientAccess from "../database/access/client.access";
import Logger from "../logger";

export async function info(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<Error | null> {
  await instance.sendMessage(
    msg.from.id,
    `
Привет! Это бот, который помогает в выборе подарков.
Можно добавить сколько угодно пользователей Telegram, чтобы видеть их виш-листы.

Для начала использования бота и регистрации системы используйте команду /start
  `
  );
  return null;
}

export async function start(
  instance: TelegramBot,
  msg: TelegramBot.Message
): Promise<Error | null> {
  const candidate = await new Client().getOneByChatID(msg.from.id.toString());
  if (!candidate) {
    const client = await new Client().register({
      tgid: msg.from.id.toString(),
      username: `${msg.from.first_name} ${msg.from.last_name}`,
    });
    if (client && client.id) {
      await instance.sendMessage(
        msg.from.id,
        `Вы были успешно зарегистрированы! Ваш Chat ID: ${msg.from.id}`
      );
    }
    Logger.log(
      "info",
      `Пользователь ${msg.from.first_name} ${msg.from.last_name} успешно зарегистрировался`
    );
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
  new Wish()
    .create(msg.chat.id.toString(), new URL(msg.text).toString())
    .then(async (data) => {
      if (data.id == -1) {
        Logger.log(
          "warning",
          `Unsupported hostname ${new URL(msg.text).hostname}`
        );
        await handParse(instance, msg);
        return;
      }
      Logger.log(
        "info",
        `Желание с ID=${data.id} добавлено в очередь на обработку`
      );
      instance.sendMessage(msg.chat.id, "Добавлено в очередь на обработку...");
    });
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
  const result = await new Wish().getWishesByID(msg.chat.id.toString());
  if (result != null && result.length > 0) {
    result.forEach(async (item) => {
      instance.sendMessage(
        msg.chat.id,
        `
${item.title || "Название: (еще нет данных)"}
Цена: ${item.price || "(еще нет данных)"} рублей
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

export async function getMyLovers(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const result = await new Client().getLoversByChatID(msg.from.id.toString());
  const items:
    | TelegramBot.InlineKeyboardButton[]
    | { text: string; callback_data: string }[][] = [[]];

  result.forEach((item) => {
    items.push(
      new Array({
        text: item.username,
        callback_data: `show ${item.tgid.toString()}`,
      })
    );
  });

  if (result != null && result.length > 0) {
    await instance.sendMessage(msg.chat.id, "Добавленные пользователи", {
      reply_markup: {
        inline_keyboard: items,
      },
    });
    return;
  }
  await instance.sendMessage(msg.chat.id, "Нечего дарить :-(");
}

export async function deleteWish(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  const result = await new Wish().deleteWish(Number(msg.text));
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
    const result = new Wish().markWishAsGifted(Number(msg.text), msg.chat.id);
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
  const uuid = await new ClientAccess().getUUIDByChatID(msg.chat.id);
  if (uuid != null && uuid.uuid) {
    const result = `${process.env.PROTOCOL || "http"}://${
      process.env.APP_HOST || "hramovdev.ru"
    }:${process.env.APP_PORT}/api/wishlist/statistics/${uuid.uuid}`;
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

export async function handParse(
  instance: TelegramBot,
  msg: TelegramBot.Message
) {
  await instance.sendMessage(
    msg.chat.id,
    `
В данный момент с этого сайта недоступен автоматический сбор информации. 
Ввести самостоятельно?
  `,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Да",
              callback_data: `hand_yes ${new URL(msg.text).toString()}`,
            },
            {
              text: "Нет",
              callback_data: "hand_no",
            },
          ],
        ],
      },
    }
  );
}
