const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "shell",
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({

      remotes: {},

      shared: {
        "@angular/core": {
          singleton: true,
          requiredVersion: '^12.0.0'
        },
        "@angular/common": {
          singleton: true,
          requiredVersion: '^12.0.0'
        },
        "@angular/router": {
          singleton: true,
          requiredVersion: '^12.0.0'
        },

        "@swimlane/ngx-charts": {
          singleton: true,
          requiredVersion: '^17.0.0'
        },

        "common": {
          singleton: true,
          import: "dist/common",
          requiredVersion: false
        },

        "core": {
          singleton: true,
          import: "dist/core",
          requiredVersion: false
        },

      }

    }),
  ],
};
