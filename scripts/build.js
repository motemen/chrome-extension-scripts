"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
const rootDir = process.cwd();
const extensions = ["ts", "tsx", "js", "jsx"];
const packageJSON = require(path.join(rootDir, "package.json"));
webpack_1.default({
    mode: "development",
    entry: Object.fromEntries(glob
        .sync(path.join(rootDir, "src", `*.{${extensions.join(",")}}`))
        .map((filepath) => [
        path.basename(filepath).replace(/\.\w+$/, ""),
        filepath,
    ])),
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
        new eslint_webpack_plugin_1.default({
            extensions,
        }),
        new clean_webpack_plugin_1.CleanWebpackPlugin(),
        new copy_webpack_plugin_1.default({
            patterns: [
                {
                    from: "src/manifest.json",
                    transform: (content) => {
                        return JSON.stringify({
                            ...JSON.parse(content.toString()),
                            version: packageJSON.version,
                        }, null, 2);
                    },
                },
                { from: "icons/*", context: "src/" },
            ],
        }),
    ],
    devtool: "inline-source-map",
    stats: "normal",
}, (err, stats) => {
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
});
