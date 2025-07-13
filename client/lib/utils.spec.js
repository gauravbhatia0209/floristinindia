"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var utils_1 = require("./utils");
(0, vitest_1.describe)("cn function", function () {
    (0, vitest_1.it)("should merge classes correctly", function () {
        (0, vitest_1.expect)((0, utils_1.cn)("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
    });
    (0, vitest_1.it)("should handle conditional classes", function () {
        var isActive = true;
        (0, vitest_1.expect)((0, utils_1.cn)("base-class", isActive && "active-class")).toBe("base-class active-class");
    });
    (0, vitest_1.it)("should handle false and null conditions", function () {
        var isActive = false;
        (0, vitest_1.expect)((0, utils_1.cn)("base-class", isActive && "active-class", null)).toBe("base-class");
    });
    (0, vitest_1.it)("should merge tailwind classes properly", function () {
        (0, vitest_1.expect)((0, utils_1.cn)("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });
    (0, vitest_1.it)("should work with object notation", function () {
        (0, vitest_1.expect)((0, utils_1.cn)("base", { conditional: true, "not-included": false })).toBe("base conditional");
    });
});
