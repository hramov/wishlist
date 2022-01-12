"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.InnerError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(msg) {
        super(`Error type: ValidationError. Error message: ${msg}`);
        this.msg = msg;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ValidationError = ValidationError;
class InnerError extends Error {
    constructor(msg) {
        super(`Error type: InnerError. Error message: ${msg}`);
        this.msg = msg;
    }
}
exports.InnerError = InnerError;
class DatabaseError extends Error {
    constructor(msg) {
        super(`Error type: DatabaseError. Error message: ${msg}`);
        this.msg = msg;
    }
}
exports.DatabaseError = DatabaseError;
