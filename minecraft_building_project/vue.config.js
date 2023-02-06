const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  outputDir: '../docs',
  publicPath: '/vue3-ThreeJs_minecraft-Building-Portfolio/',
})
