import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

import * as glob from "glob";
import * as path from "path";

const rootDir = path.join(__dirname, "..", "..", "..");
const extensions = ["ts", "tsx", "js", "jsx"];

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
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/manifest.json",
            transform: (content) => {
              return JSON.stringify({
                ...JSON.parse(content.toString()),
                version: process.env.npm_package_version,
              });
            },
          },
          { from: "icons/*", context: "src/" },
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
