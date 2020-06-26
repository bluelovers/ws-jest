"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCheckTypes = void 0;
const check_types_1 = __importDefault(require("check-types"));
const msg_1 = require("./msg");
function createNewCheckTypes(matcherName, type) {
    return function toBeCheckTypes(received) {
        const pass = check_types_1.default[type](received);
        return {
            pass,
            message: msg_1.autoMessage(pass, received, matcherName, type),
        };
    };
}
exports.createNewCheckTypes = createNewCheckTypes;
//# sourceMappingURL=lazy-check-types.js.map