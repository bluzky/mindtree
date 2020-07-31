const manifest = require("../manifest"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  // vue
  // {
  //   test: /\.vue$/,
  //   loader: 'vue-loader',
  //   options: {
  //     loaders: {
  //       js: 'babel-loader'
  //     }
  //   }
  // },

  // {
  //   test: /\.svelte$/,
  //   exclude: /node_modules/,
  //   use: {
  //     loader: "svelte-loader",
  //     options: {
  //       emitCss: true,
  //       hotReload: true
  //     }
  //   }
  // },

  // js
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
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
          outputPath: 'images'
        }
      }
    ]
  },

  {
    // Apply rule for .sass, .scss or .css files
    test: /\.(sa|sc|c)ss$/,

    // Set loaders to transform files.
    // Loaders are applying from right to left(!)
    // The first loader will be applied after others
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        // This loader resolves url() and @imports inside CSS
        loader: "css-loader",
      },
      {
        // Then we apply postCSS fixes like autoprefixer and minifying
        loader: "postcss-loader"
      },
      {
        // First we transform SASS to standard CSS
        loader: "sass-loader",
        options: {
          implementation: require("sass")
        }
      }
    ]
  },

  // fonts
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    //  exclude: /(node_modules)/,
    use: {
      loader: "file-loader?limit=30000",
      options: {
        outputPath: "fonts"
      }
    }
  }
];
