"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCheckTypes = void 0;
const check_types_1 = __importDefault(require("check-types"));
const jest_util_1 = require("@lazy-assert/jest-util");
function createNewCheckTypes(matcherName, type) {
    return function toBeCheckTypes(received) {
        // @ts-ignore
        const pass = check_types_1.default[type](received);
        return {
            pass,
            message: (0, jest_util_1.autoMessage)(pass, received, matcherName, type),
            actual: received,
            expected: type,
            name: matcherName,
        };
    };
}
exports.createNewCheckTypes = createNewCheckTypes;
//# sourceMappingURL=lazy-check-types.js.map