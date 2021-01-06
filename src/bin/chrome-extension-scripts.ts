#!/usr/bin/env node

import spawn from "cross-spawn";
import { isUnderTSNode } from "../lib/utils";

const args = process.argv;
const command = args[2];

try {
  const script = require.resolve(`../scripts/${command}`);
  const result = spawn.sync(
    args[0],
    [...(isUnderTSNode() ? ["--script-mode"] : []), script, ...args.slice(2)],
    { stdio: "inherit" }
  );
  process.exit(result.status ?? 1);
} catch (_err) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
