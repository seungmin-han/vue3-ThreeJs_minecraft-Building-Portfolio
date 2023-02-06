const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "/vue3-ThreeJs_minecraft-Building-Portfolio/" : "/",
})
