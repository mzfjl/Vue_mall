const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('assets', path.resolve(__dirname, 'src/assets'))
      .set('components', path.resolve(__dirname, 'src/components'))
      .set('common', path.resolve(__dirname, 'src/common'))
      .set('views', path.resolve(__dirname, 'src/views'))
  },
  devServer: {
    proxy: {
      api: {
        target: 'http://localhost:3000/',
        changeOrgin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})
