import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import * as yargs from "yargs";

import { isUnderTSNode } from "../lib/utils";

import * as glob from "glob";
import * as path from "path";

const argv = yargs
  .option("src", {
    default: "src",
    type: "string",
  })
  .option("build", {
    default: "build",
    type: "string",
  })
  .option("watch", {
    default: false,
    type: "boolean",
  }).argv;

const srcDir = argv.src;
const buildDir = argv.build;
const modeWatch = argv.watch;

const rootDir = process.cwd();
const scriptsRoot = isUnderTSNode() ? path.join("..", "..") : path.join("..");

const extensions = ["ts", "tsx", "js", "jsx"];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require(path.join(rootDir, "package.json"));

webpack(
  {
    ...(modeWatch
      ? {
          watch: true,
          mode: "development",
        }
      : {
          mode: "production",
        }),
    // FIXME: directory structure?
    entry: Object.fromEntries(
      glob
        .sync(path.join(rootDir, srcDir, `*.{${extensions.join(",")}}`))
        .map((filepath) => [
          path.basename(filepath).replace(/\.\w+$/, ""),
          filepath,
        ])
    ),
    context: rootDir,
    output: {
      path: path.join(rootDir, buildDir),
    },
    resolve: {
      extensions: extensions.map((ext) => `.${ext}`),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        extensions,
        eslintPath: require.resolve("eslint"),
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve(path.join(scriptsRoot, ".eslintrc.json"))],
        },
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, "manifest.json"),
            transform: (content) => {
              return JSON.stringify(
                {
                  ...JSON.parse(content.toString()),
                  version: packageJSON.version,
                },
                null,
                2
              );
            },
          },
          { from: "{assets,html}/**", context: srcDir, noErrorOnMissing: true },
        ],
      }),
    ],
    devtool: "inline-source-map",
    stats: "normal",
  },
  (err, stats) => {
    if (stats) {
      if (stats.hasErrors()) {
        console.error(stats.toString("errors-warnings"));
        process.exitCode = 1;
        return;
      }
      console.log(stats.toString({ colors: true }));
    }
    if (err) {
      throw err;
    }
  }
);
