import { red, yellow, blue, green } from "cli-color";
import { LoggerMessage, LoggerType } from "./types";
import { appendFile } from "fs";

export default class Logger {
  static log(type: LoggerType, message: LoggerMessage): void {
    message = `${
      new Date(Date.now()).toLocaleDateString() +
      " " +
      new Date(Date.now()).toLocaleTimeString()
    } | ${message}`;
    switch (type) {
      case "debug":
        console.log(blue(message));
        break;
      case "error":
        console.log(red(message));
        break;
      case "info":
        console.log(green(message));
        break;
      case "warning":
        console.log(yellow(message));
        break;
    }

    Logger.writeToFile(type, message);
  }

  static writeToFile(type: LoggerType, message: LoggerMessage) {
    message = `${type} | ${message}`;

    appendFile(
      process.env.LOGGER_FOLDER +
        `/${Logger.makeFileName(
          new Date(Date.now()).toLocaleDateString("ru-RU")
        )}.txt`,
      message + "\n",
      (err) => {
        if (err) Logger.log("error", err.message);
      }
    );
  }

  static makeFileName(date: string): string {
    return date.split(".").join("_");
  }
}
