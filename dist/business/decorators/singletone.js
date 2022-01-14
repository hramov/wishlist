"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = exports.SINGLETON_KEY = void 0;
exports.SINGLETON_KEY = Symbol();
const Singleton = (type) => new Proxy(type, {
    construct(target, argsList, newTarget) {
        if (target.prototype !== newTarget.prototype) {
            return Reflect.construct(target, argsList, newTarget);
        }
        if (!target[exports.SINGLETON_KEY]) {
            target[exports.SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget);
        }
        return target[exports.SINGLETON_KEY];
    },
});
exports.Singleton = Singleton;
