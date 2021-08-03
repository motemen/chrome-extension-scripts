// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { zipSync } from "cross-zip";
import * as path from "path";
import * as yargs from "yargs";

(async () => {
  const argv = await yargs.option("build", {
    default: "build",
    type: "string",
  }).argv;

  const rootDir = process.cwd();
  const buildDir = argv.build;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const manifest = require(path.join(rootDir, buildDir, "manifest.json"));

  zipSync(
    path.join(rootDir, buildDir),
    `${manifest.name.replace(/\W/g, "_")}-${manifest.version}.zip`
  );
})();
