let path = require("path");
let VueLoaderPlugin = require("vue-loader/lib/plugin");
let marked = require("marked");
// let renderer = new marked.Renderer();
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
let htmlWebpackPlugin = require("html-webpack-plugin");
let sanitizeHTML = require("sanitize-html");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
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
            loader: "markdown-loader"/*,
            options: {
              renderer
            }*/
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
      favicon: "./src/favicon.ico"
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      vue: path.resolve(__dirname, "node_modules/vue/dist/vue.esm.js")
    }
  }
};
