"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_wish_1 = __importDefault(require("../../business/wish/main.wish"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get("/", (_, res) => {
    res.sendFile(path_1.default.join(__dirname + '../../../../static/public/html/index.html'));
});
router.get("/statistics/:uuid", async (req, res) => {
    res.send(await new main_wish_1.default(null).stats(req.params.uuid));
});
exports.default = router;
