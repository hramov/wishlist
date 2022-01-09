"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_color_1 = require("cli-color");
const fs_1 = require("fs");
class Logger {
    static log(type, message) {
        message = `${new Date(Date.now()).toLocaleDateString() +
            " " +
            new Date(Date.now()).toLocaleTimeString()} | ${message}`;
        switch (type) {
            case "debug":
                console.log((0, cli_color_1.blue)(message));
                break;
            case "error":
                console.log((0, cli_color_1.red)(message));
                break;
            case "info":
                console.log((0, cli_color_1.green)(message));
                break;
            case "warning":
                console.log((0, cli_color_1.yellow)(message));
                break;
        }
        Logger.writeToFile(type, message);
    }
    static writeToFile(type, message) {
        message = `${type} | ${message}`;
        (0, fs_1.appendFile)(process.env.LOGGER_FOLDER +
            `/${Logger.makeFileName(new Date(Date.now()).toLocaleDateString("ru-RU"))}.txt`, message + "\n", (err) => {
            if (err)
                Logger.log("error", err.message);
        });
    }
    static makeFileName(date) {
        return date.split(".").join("_");
    }
}
exports.default = Logger;
