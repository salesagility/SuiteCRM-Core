const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../../tsconfig.json'),
  []);

module.exports = {
  output: {
    uniqueName: "shell"
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
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({

      remotes: {},

      shared: {
        "@angular/core": {
          singleton: true,
          version: '11.0.0',
          requiredVersion: '^11.0.0'
        },
        "@angular/common": {
          singleton: true,
          version: '11.0.0',
          requiredVersion: '^11.0.0'
        },
        "@angular/router": {
          singleton: true,
          version: '11.0.0',
          requiredVersion: '^11.0.0'
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
