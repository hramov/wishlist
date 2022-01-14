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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_access_1 = __importDefault(require("../../modules/database/access/client.access"));
const logger_1 = __importDefault(require("../../modules/logger"));
const singletone_1 = require("../decorators/singletone");
const validators_1 = require("../validation/validators");
let Client = class Client {
    constructor(access = new client_access_1.default()) {
        this.access = access;
    }
    async register(client) {
        return await this.access.registerAccess(client);
    }
    async getOneByChatID(id) {
        return await this.access.getOneByChatIDAccess(id);
    }
    async getLoversByChatID(id) {
        return await this.access.getLoversByChatIDAccess(id);
    }
    async createLink(tgid) {
        return `
Присоединяйся ко мне в Wish List Exchange \u{1F64C} (перейди по ссылке и нажми кнопку START):
https://t.me/${process.env.BOT_NAME || "hramovdevbot"}?start=${tgid}`;
    }
    async bindLover(client, lover_id) {
        const candidate = await this.access.getOneByChatIDAccess(client.tgid);
        const lover = await this.access.getOneByChatIDAccess(lover_id);
        if (candidate == null || candidate.id == null) {
            client = await this.access.registerAccess(client);
            logger_1.default.log("info", `User ${client.username} successfully registered`);
        }
        if (lover == null || lover.id == null) {
            return false;
        }
        return (await this.access.bindLoverAccess(client.tgid, lover_id)).result;
    }
};
__decorate([
    __param(0, validators_1.isString),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Client.prototype, "getOneByChatID", null);
__decorate([
    __param(0, validators_1.isString),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], Client.prototype, "createLink", null);
Client = __decorate([
    singletone_1.Singleton,
    __metadata("design:paramtypes", [Object])
], Client);
exports.default = Client;
