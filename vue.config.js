const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");

    // Exclude .svg files from the default file loader
    svgRule.exclude.add(/\.svg$/);

    // Add a new rule for handling .svg files with vue-svg-loader
    config.module
      .rule("inline-svg")
      .test(/\.svg$/)
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
};

