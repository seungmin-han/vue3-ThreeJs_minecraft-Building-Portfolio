const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  outputDir: '../docs',
  publicPath: `${process.env.VUE_APP_PUBLIC_PATH}/`,
})
