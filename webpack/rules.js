const manifest = require("./manifest");

module.exports = [
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  },

  {
    // Now we apply rule for images
    test: /\.(png|jpe?g|gif|svg)$/,
    use: [
      {
        // Using file-loader for these files
        loader: "file-loader",

        // In options we can set different things like format
        // and directory to save
        options: {
          outputPath: "images",
        },
      },
    ],
  },
];
