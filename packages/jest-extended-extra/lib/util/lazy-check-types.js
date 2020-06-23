"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewCheckTypes = void 0;
const jest_matcher_utils_1 = require("jest-matcher-utils");
const check_types_1 = __importDefault(require("check-types"));
const passMessage = (received, matcherName, type) => () => jest_matcher_utils_1.matcherHint(`.not.${matcherName}`, 'received', '') +
    '\n\n' +
    `Expected value to not be a ${type} received:\n` +
    `  ${jest_matcher_utils_1.printReceived(received)}`;
const failMessage = (received, matcherName, type) => () => jest_matcher_utils_1.matcherHint(`.${matcherName}`, 'received', '') +
    '\n\n' +
    `Expected value to be a ${type} received:\n` +
    `  ${jest_matcher_utils_1.printReceived(received)}`;
function createNewCheckTypes(matcherName, type) {
    return function toBeFloat(received) {
        const pass = check_types_1.default[type](received);
        if (pass) {
            return {
                pass: true,
                message: passMessage(received, matcherName, type),
            };
        }
        return {
            pass: false,
            message: failMessage(received, matcherName, type),
        };
    };
}
exports.createNewCheckTypes = createNewCheckTypes;
//# sourceMappingURL=lazy-check-types.js.map