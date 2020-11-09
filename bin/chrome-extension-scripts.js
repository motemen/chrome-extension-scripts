#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_1 = __importDefault(require("cross-spawn"));
process.on("unhandledRejection", (err) => {
    throw err;
});
const args = process.argv.slice(2);
const command = args[0];
if (command === "build") {
    const result = cross_spawn_1.default.sync(process.execPath, [require.resolve(`../scripts/${command}`), ...args.slice(1)], { stdio: "inherit" });
    process.exit((_a = result.status) !== null && _a !== void 0 ? _a : 1);
}
else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
