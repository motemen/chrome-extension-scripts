import { isUnderTSNode } from "../lib/utils";

import * as path from "path";
import { execFileSync } from "child_process";

const scriptsRoot = isUnderTSNode()
  ? path.join(__dirname, "..", "..")
  : path.join(__dirname, "..");
const binPath = path.join(scriptsRoot, "node_modules", ".bin");

const extensions = ["ts", "tsx", "js", "jsx"];

const exec = (cmd: string, ...args: string[]) => {
  console.log(`# ${cmd} ${args.join(" ")}`);
  const fullCmd = path.join(binPath, cmd);
  // TODO: do not show long stack traces on fail
  execFileSync(fullCmd, args, {
    stdio: "inherit",
  });
};

exec("prettier", "--write", "src");

exec(
  "eslint",
  "--fix",
  "--config",
  path.join(scriptsRoot, ".eslintrc.json"),
  "--resolve-plugins-relative-to",
  scriptsRoot,
  "--ext",
  extensions.join(","),
  "src/"
);
