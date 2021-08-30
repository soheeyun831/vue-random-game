const path = require('path');

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/'),
        '~': path.join(__dirname, '/'),
      },
    },
  },
  css: {
    loaderOptions: {
      // by default the `sass` option will apply to both syntaxes
      // because `scss` syntax is also processed by sass-loader underlyingly
      // but when configuring the `data` option
      // `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
      // in that case, we can target the `scss` syntax separately using the `scss` option
      sass: {
        additionalData: `
@import "@/assets/scss/base/color.scss";
@import "@/assets/scss/base/fonts.scss";
@import "@/assets/scss/base/base.scss";
`,
      },
    },
  },
};
