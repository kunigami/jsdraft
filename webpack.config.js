const path = require("path");

module.exports = {
  entry: "./05_visited/prod/main.js",
  output: {
    path: path.resolve("./05_visited/", "prod"),
    filename: "bundle.js"
  }
};
