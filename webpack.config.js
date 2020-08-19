let path = require("path");
let VueLoaderPlugin = require("vue-loader/lib/plugin");
let marked = require("marked");
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
let htmlWebpackPlugin = require("html-webpack-plugin");
let sanitizeHTML = require("sanitize-html");
let FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.css$/i,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            // https://github.com/vuejs/vue-style-loader/issues/46#issuecomment-670624576
            options: {
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader",
            options: {
              preprocessor: (content) => {
                return sanitizeHTML(content, {
                  allowedTags: sanitizeHTML.defaults.allowedTags.concat(["h1","h2","img"])
                });
              }
            }
          },
          {
            loader: "markdown-loader"
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: "./src/index.html",
      cache: false
    }),
    new FaviconsWebpackPlugin("./src/x.svg"),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      vue: path.resolve(__dirname, "node_modules/vue/dist/vue.esm.js")
    }
  }
};
