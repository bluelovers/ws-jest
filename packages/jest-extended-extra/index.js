"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchers = void 0;
const jest_install_matcher_extends_1 = require("jest-install-matcher-extends");
const matchers_1 = require("./lib/matchers");
Object.defineProperty(exports, "matchers", { enumerable: true, get: function () { return matchers_1.matchers; } });
exports.default = matchers_1.matchers;
(0, jest_install_matcher_extends_1.jestAutoInstallExpectExtend)(matchers_1.matchers);
//# sourceMappingURL=index.js.map