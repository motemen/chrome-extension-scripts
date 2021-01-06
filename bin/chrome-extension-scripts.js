#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const utils_1 = require("../lib/utils");
const args = process.argv;
const command = args[2];
try {
    const script = require.resolve(`../scripts/${command}`);
    const result = cross_spawn_1.default.sync(args[0], [...(utils_1.isUnderTSNode() ? ["--script-mode"] : []), script, ...args.slice(2)], { stdio: "inherit" });
    process.exit((_a = result.status) !== null && _a !== void 0 ? _a : 1);
}
catch (_err) {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
