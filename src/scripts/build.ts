import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import {
  Options as ESLintWebpackPluginOptions,
  ESLintOptions,
} from "eslint-webpack-plugin/declarations/options";
import { REGISTER_INSTANCE } from "ts-node";

import * as glob from "glob";
import * as path from "path";

const rootDir = process.cwd();
const scriptsRoot =
  REGISTER_INSTANCE in process ? path.join("..", "..") : path.join("..");

const extensions = ["ts", "tsx", "js", "jsx"];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require(path.join(rootDir, "package.json"));

webpack(
  {
    mode: "development",
    entry: Object.fromEntries(
      glob
        .sync(path.join(rootDir, "src", `*.{${extensions.join(",")}}`))
        .map((filepath) => [
          path.basename(filepath).replace(/\.\w+$/, ""),
          filepath,
        ])
    ),
    context: rootDir,
    output: {
      path: path.join(rootDir, "build"),
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
      } as ESLintOptions & ESLintWebpackPluginOptions),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/manifest.json",
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
          { from: "assets/**", context: "src/" },
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
