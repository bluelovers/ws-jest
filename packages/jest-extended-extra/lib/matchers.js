"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchers = void 0;
const toBeFinite_1 = __importDefault(require("./matchers/toBeFinite"));
const toBeFloat_1 = __importDefault(require("./matchers/toBeFloat"));
const toBeInfinity_1 = __importDefault(require("./matchers/toBeInfinity"));
const toBeInteger_1 = __importDefault(require("./matchers/toBeInteger"));
const toBeNegative_1 = __importDefault(require("./matchers/toBeNegative"));
const toBePositive_1 = __importDefault(require("./matchers/toBePositive"));
const toBeZero_1 = __importDefault(require("./matchers/toBeZero"));
exports.matchers = {
    ...toBeFinite_1.default,
    ...toBeFloat_1.default,
    ...toBeInfinity_1.default,
    ...toBeInteger_1.default,
    ...toBeNegative_1.default,
    ...toBePositive_1.default,
    ...toBeZero_1.default
};
exports.default = exports.matchers;
//# sourceMappingURL=matchers.js.map