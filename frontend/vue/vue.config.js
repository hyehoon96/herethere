const CompressionPlugin = require("compression-webpack-plugin")

let plugins = []

if (process.env.NODE_ENV === "production") {
    const compressionTest = /\.(js|css|html|ico)(\?.*)?$/i
    plugins = [
        new CompressionPlugin({
            algorithm: "gzip",
            compressionOptions: {
                numiterations: 15
            },
            minRatio: 0.8,
            test: compressionTest,
            threshold: 10240
        }),
    ]
}
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins
  },
  outputDir: '../../backend/public',

  transpileDependencies: [
    'vuetify'
  ]
}
