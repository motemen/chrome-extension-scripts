#!/usr/bin/env node

import spawn from "cross-spawn";

process.on("unhandledRejection", (err) => {
  throw err;
});

const args = process.argv.slice(2);
const command = args[0];

if (command === "build") {
  const result = spawn.sync(
    process.execPath,
    [require.resolve(`../scripts/${command}`), ...args.slice(1)],
    { stdio: "inherit" }
  );
  process.exit(result.status ?? 1);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
