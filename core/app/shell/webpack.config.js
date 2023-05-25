const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    uniqueName: 'shell',
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({

      remotes: {},

      shared: {
        '@angular/core': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@angular/common': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@angular/common/http': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@angular/router': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@angular/animations': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@angular/cdk': {
          singleton: true,
          requiredVersion: '^13.3.9'
        },
        '@angular/cdk/table': {
          singleton: true,
          requiredVersion: '^13.3.9'
        },
        '@angular/cdk/observers': {
          singleton: true,
          requiredVersion: '^13.3.9'
        },
        '@angular/forms': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        '@apollo/client': {
          singleton: true,
          requiredVersion: '^3.3.7'
        },
        '@apollo/link-error': {
          singleton: true,
          requiredVersion: '^2.0.0-beta.3'
        },
        'angular-svg-icon': {
          singleton: true,
          requiredVersion: '^13.0.0'
        },
        'apollo-angular': {
          singleton: true,
          requiredVersion: '^2.2.0'
        },
        graphql: {
          singleton: true,
          requiredVersion: '^14.7.0'
        },
        'graphql-tag': {
          singleton: true,
          requiredVersion: '^2.11.0'
        },
        'lodash-es': {
          singleton: true,
          requiredVersion: '^4.17.20'
        },
        luxon: {
          singleton: true,
          requiredVersion: '3.3.0'
        },
        'ng-animate': {
          singleton: true,
          requiredVersion: '^2.0.1'
        },
        'ngx-chips': {
          singleton: true,
          requiredVersion: '^3.0.0'
        },

        '@swimlane/ngx-charts': {
          singleton: true,
          requiredVersion: '^19.2.0'
        },

        '@ng-bootstrap/ng-bootstrap': {
          singleton: true,
          requiredVersion: '^11.0.0'
        },

        'bn-ng-idle': {
          singleton: true,
          requiredVersion: '^2.0.5'
        },

        'rxjs': {
          singleton: true,
          requiredVersion: '^6.6.3'
        },

        'rxjs/operators': {
          singleton: true,
          requiredVersion: '^6.6.3'
        },

        common: {
          singleton: true,
          import: 'dist/common',
          requiredVersion: false
        },

        core: {
          singleton: true,
          import: 'dist/core',
          requiredVersion: false
        },

      }

    }),
  ],
};
