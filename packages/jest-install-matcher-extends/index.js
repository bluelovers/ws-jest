"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jestAutoInstallExpectExtend = exports.jestInstallExpectExtend = exports.getGlobalExpect = void 0;
function getGlobalExpect() {
    // @ts-ignore
    if (typeof global !== 'undefined' && global.expect) {
        // @ts-ignore
        return global.expect;
    }
    // @ts-ignore
    else if (typeof globalThis !== 'undefined' && globalThis.expect) {
        // @ts-ignore
        return globalThis.expect;
    }
    // @ts-ignore
    else if (typeof window !== 'undefined' && window.expect) {
        // @ts-ignore
        return window.expect;
    }
}
exports.getGlobalExpect = getGlobalExpect;
function jestInstallExpectExtend(matchers, expect) {
    return (expect !== null && expect !== void 0 ? expect : getGlobalExpect()).extend(matchers);
}
exports.jestInstallExpectExtend = jestInstallExpectExtend;
function jestAutoInstallExpectExtend(matchers, options) {
    var _a, _b, _c;
    const expect = (_a = options === null || options === void 0 ? void 0 : options.expect) !== null && _a !== void 0 ? _a : getGlobalExpect();
    if (typeof expect !== 'undefined') {
        expect.extend(matchers);
        (_b = options === null || options === void 0 ? void 0 : options.cbExists) === null || _b === void 0 ? void 0 : _b.call(options, matchers, options);
    }
    else {
        (_c = options === null || options === void 0 ? void 0 : options.cbNotExists) === null || _c === void 0 ? void 0 : _c.call(options, matchers, options);
    }
}
exports.jestAutoInstallExpectExtend = jestAutoInstallExpectExtend;
exports.default = jestAutoInstallExpectExtend;
//# sourceMappingURL=index.js.map