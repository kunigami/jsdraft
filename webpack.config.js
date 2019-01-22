const path = require("path");

module.exports = {
  entry: {
    world_travel: "./build/js/world_travel/main.js"
  },
  output: {
    path: path.resolve("./prod/js/"),
    filename: "[name].bundle.js"
  }
};
