// const JSEncodePlugin = require('./jjencode.js')
import config from './init.config'
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? config.qiniu_cdn : './', // /cosleep/teacher/    ./ https://webres.psy-1.com/sgy/dist
  assetsDir: './',
  // configureWebpack: {
  //   plugins: [
  //     new JSEncodePlugin({
  //       global: '$',
  //       jsReg: /^app\..+\.js/,
  //       assetsPath: './dist/js'
  //     })
  //   ]
  // },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimizer: [new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        })]
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/GlobalScss/setSize.scss";` // @import "@/globalscss/setSize.scss";
      }
    }
  }
}
