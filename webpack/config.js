// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Entry Point Setup
 * + @Path Resolving
 * + @Exporting Module
 */

// ---------------------
// @Loading Dependencies
// ---------------------

const path = require("path"),
  manifest = require("./manifest"),
  rules = require("./rules"),
  plugins = [],
  TerserPlugin = require("terser-webpack-plugin");

// ------------------
// @Entry Point Setup
// ------------------

var entries = {};
for (var key in manifest.entries) {
  entries[key] = path.join(manifest.paths.src, manifest.entries[key]);
}

// ---------------
// @Path Resolving
// ---------------

const resolve = {
  extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
  modules: [
    path.join(__dirname, "../node_modules"),
    path.join(manifest.paths.src, ""),
  ],
};

// ---------------
// @Optimization and split chunk
// -------------
var optimization = {
  nodeEnv: "production",
};

if (manifest.IS_PRODUCTION) {
  optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
    }),
  ];
}

// -----------------
// @Exporting Module
// -----------------

var devServer = {
  contentBase: path.join(__dirname, "../"),
  compress: true,
  port: 8000,
};

module.exports = {
  devtool: manifest.IS_PRODUCTION ? false : "inline-source-map",
  context: manifest.paths.src,
  entry: entries,
  output: {
    library: "mindtree",
    libraryTarget: "umd",
    globalObject: "this",
    path: manifest.paths.build,
    publicPath: manifest.paths.public_path,
    filename: manifest.outputFiles.bundle,
  },
  module: {
    rules,
  },
  resolve,
  externals: {
    window: "window",
  },
  plugins,
  optimization,
  devServer,
};
