// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Environment Holders
 * + @Utils
 * + @App Paths
 * + @Output Files Names
 * + @Entries Files Names
 * + @Exporting Module
 */

// ---------------------
// @Loading Dependencies
// ---------------------

const path = require("path");

// --------------------
// @Environment Holders
// --------------------

const NODE_ENV = process.env.NODE_ENV || "development",
  IS_DEVELOPMENT = NODE_ENV === "development",
  IS_PRODUCTION = NODE_ENV === "production";

// ------
// @Utils
// ------

const dir = src => path.join(__dirname, src);

// ----------
// @App Paths
// ----------

const paths = {
  src: dir("../src"),
  build: dir("../build/static"),
  public_path: "/build/",
  js_source_dir: ""
};

// -------------------
// @Output Files Names
// -------------------

const outputFiles = {
  bundle: "js/[name].js",
  css: "css/[name].css"
};

// --------------------
// @Entries Files Names
// --------------------

const entries = {
  app: "js/index.js",
  admin: "js/admin.js",
  "page/test": "js/page/test.js"
};

// -----------------
// @Exporting Module
// -----------------

module.exports = {
  paths,
  outputFiles,
  entries,
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION
};
