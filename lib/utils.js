"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnderTSNode = void 0;
const isUnderTSNode = () => {
    return Symbol.for("ts-node.register.instance") in process;
};
exports.isUnderTSNode = isUnderTSNode;
