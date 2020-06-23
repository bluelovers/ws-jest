"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchers = void 0;
const toBeFloat_1 = __importDefault(require("./matchers/toBeFloat"));
const toBeInteger_1 = __importDefault(require("./matchers/toBeInteger"));
const toBeZero_1 = __importDefault(require("./matchers/toBeZero"));
exports.matchers = Object.assign(toBeFloat_1.default, toBeInteger_1.default, toBeZero_1.default);
exports.default = exports.matchers;
//# sourceMappingURL=matchers.js.map