// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { zipSync } from "cross-zip";
import * as path from "path";

const rootDir = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const manifest = require(path.join(rootDir, "build", "manifest.json"));

zipSync(
  path.join(rootDir, "build"),
  `${manifest.name.replace(/\W/g, "_")}-${manifest.version}.zip`
);
