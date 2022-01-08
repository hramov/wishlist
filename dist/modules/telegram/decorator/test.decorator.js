"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = void 0;
function method(target, propertyName, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        // let returnValue = originalMethod.apply(this);
        return originalMethod.apply(this);
    };
}
exports.method = method;
