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
const wish_access_1 = __importDefault(require("../../modules/database/access/wish.access"));
const logger_1 = __importDefault(require("../../modules/logger"));
const singletone_1 = require("../decorators/singletone");
let Wish = class Wish {
    constructor(access = new wish_access_1.default()) {
        this.access = access;
    }
    async create(client_id, href) {
        const result = await this.access.createMinWishAccess(client_id, href);
        if (result && result.id) {
            logger_1.default.log("info", `Wish with id ${result.id} successfully added to database`);
            const isAuto = await this.access.isAutoAccess(new URL(href).hostname);
            if (!isAuto || !isAuto.auto) {
                return Object.assign(Object.assign({}, result), { isAuto: false });
            }
            return Object.assign(Object.assign({}, result), { isAuto: true });
        }
    }
    async getWishesByID(client_id) {
        return await this.access.getWishesByID(client_id);
    }
    async getWishByID(wish_id) {
        return await this.access.getWishByID(wish_id);
    }
    async deleteWish(id) {
        return await this.access.deleteWishByID(id);
    }
    async markWishAsGifted(wish_id, client_id) {
        return await this.access.buyWish(wish_id, client_id);
    }
    async stats(client_uuid) {
        return await this.access.getSpendedMoney(client_uuid);
    }
};
Wish = __decorate([
    singletone_1.Singleton,
    __metadata("design:paramtypes", [Object])
], Wish);
exports.default = Wish;
