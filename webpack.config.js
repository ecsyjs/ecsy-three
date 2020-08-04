const path = require("path");

module.exports = {
  entry: {
    "spinning-cube": path.resolve(__dirname, "examples", "spinning-cube.js")
  },
  resolve: {
    alias: {
      "ecsy-three": path.resolve(__dirname, "src", "index.js")
    }
  },
  output: {
    path: path.resolve(__dirname, "site", "examples", "scripts"),
    filename: "[name].js",
  },
  devServer: {
    publicPath: "/examples/scripts/",
    contentBase: path.resolve(__dirname, "site"),
  },
};