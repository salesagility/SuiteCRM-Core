module.exports = {
  output: {
    uniqueName: "core"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
    ]
  },
  plugins: [],
};
