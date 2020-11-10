#!/usr/bin/env node

import spawn from "cross-spawn";

const args = process.argv;
const command = args[2];

const underTypeScript = (process as any)[
  Symbol.for("ts-node.register.instance")
];

try {
  const script = require.resolve(`../scripts/${command}`);
  const result = spawn.sync(
    args[0],
    [...(underTypeScript ? ["--script-mode"] : []), script, ...args.slice(2)],
    { stdio: "inherit" }
  );
  process.exit(result.status ?? 1);
} catch (_err) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
