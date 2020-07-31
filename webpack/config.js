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
  plugins = require("./plugins"),
  UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// ------------------
// @Entry Point Setup
// ------------------

var entries = {};
for (var key in manifest.entries) {
  entries[key] = path.join(manifest.paths.src, manifest.paths.js_source_dir, manifest.entries[key]);
}

// ---------------
// @Path Resolving
// ---------------

const resolve = {
  extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
  modules: [
    path.join(__dirname, "../node_modules"),
    path.join(manifest.paths.src, "")
  ]
};

// ---------------
// @Optimization and split chunk
// -------------
var optimization = {
  nodeEnv: "production",
  splitChunks: {
    chunks: "all",
    cacheGroups: {
      commons: {
        chunks: "all",
        name: "commons",
        priority: 1
      },
      // vendors: {
      //           test: /[\\/]node_modules[\\/]/,
      //           priority: -10
      //         },
      default: false
    }
  }
};

if (manifest.IS_PRODUCTION) {
  optimization.minimizer = [
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        compress: {
          comparisons: true,
          conditionals: true,
          dead_code: true,
          drop_debugger: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          sequences: true,
          unused: true,
          warnings: false
        },

        output: {
          comments: false
        }
      }
    })
  ];
}

// -----------------
// @Exporting Module
// -----------------

var devServer = {
  contentBase: path.join(__dirname, "../"),
  compress: true,
  port: 8000
};

module.exports = {
  devtool: manifest.IS_PRODUCTION ? false : "inline-source-map",
  context: path.join(manifest.paths.src, manifest.paths.js_source_dir),
  entry: entries,
  output: {
    path: manifest.paths.build,
    publicPath: manifest.paths.public_path,
    filename: manifest.outputFiles.bundle
  },
  module: {
    rules
  },
  resolve,
  externals: {
    window: "window"
  },
  plugins,
  optimization,
  devServer
};
