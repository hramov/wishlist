"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const singletone_1 = require("../../business/decorators/singletone");
const logger_1 = __importDefault(require("../logger"));
const router_1 = __importDefault(require("./router"));
let Server = class Server {
    constructor(port) {
        this.port = port;
        this.port = port;
    }
    async createServer() {
        const server = (0, express_1.default)();
        server.use("/api/wishlist/", router_1.default);
        server.use("/", express_1.default.static("public"));
        server.listen(this.port || process.env.APP_PORT, () => {
            logger_1.default.log("info", `The server has been started at port ${this.port || process.env.APP_PORT}`);
        });
    }
};
Server = __decorate([
    singletone_1.Singleton,
    __metadata("design:paramtypes", [Number])
], Server);
exports.default = Server;
