const path = require('path')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve(__dirname, './'))
      .set('@', path.resolve(__dirname, 'src'))
  }
}