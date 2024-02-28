const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    uniqueName: 'shell',
  },
  optimization: {
    runtimeChunk: false,
    minimize: true
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({

      remotes: {},

      shared: {
        '@angular/core': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/common': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/common/http': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/router': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/animations': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/cdk': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/cdk/table': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/cdk/observers': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@angular/forms': {
          singleton: true,
          requiredVersion: '^16.1.1'
        },
        '@apollo/client': {
          singleton: true,
          requiredVersion: '^3.7.14'
        },
        'angular-svg-icon': {
          singleton: true,
          requiredVersion: '^16.0.0'
        },
        'apollo-angular': {
          singleton: true,
          requiredVersion: '^5.0.0'
        },
        graphql: {
          singleton: true,
          requiredVersion: '^16.7.1'
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
          requiredVersion: '^20.3.0'
        },

        '@ng-bootstrap/ng-bootstrap': {
          singleton: true,
          requiredVersion: '^15.0.1'
        },

        'bn-ng-idle': {
          singleton: true,
          requiredVersion: '^2.0.5'
        },

        'rxjs': {
          singleton: true,
          requiredVersion: '^7.8.1'
        },

        'rxjs/operators': {
          singleton: true,
          requiredVersion: '^7.8.1'
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
