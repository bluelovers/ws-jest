"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchers = void 0;
const jest_install_matcher_extends_1 = __importDefault(require("jest-install-matcher-extends"));
const matchers_1 = require("./lib/matchers");
Object.defineProperty(exports, "matchers", { enumerable: true, get: function () { return matchers_1.matchers; } });
exports.default = matchers_1.matchers;
(0, jest_install_matcher_extends_1.default)(matchers_1.matchers);
//# sourceMappingURL=index.js.map