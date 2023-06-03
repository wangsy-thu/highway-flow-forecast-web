//webpack也是需要导入的，
const webpack = require('webpack')
//导入copy-webpack-plugin插件
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // 在module.exports中添加下列配置
  configureWebpack: (config) => {
    const cesiumSourcePath = 'node_modules/mars3d-cesium/Build/Cesium/' // cesium库安装目录
    const cesiumRunPath = './mars3d-cesium/' // cesium运行时路径
    const plugins = [
      // 标识cesium资源所在的主目录，cesium内部资源加载、多线程等处理时需要用到
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(path.join(config.output.publicPath, cesiumRunPath))
      }),
      // Cesium相关资源目录需要拷贝到系统目录下面（部分CopyWebpackPlugin版本的语法可能需要patterns，代码在最下面）
      new CopyWebpackPlugin([
        { from: path.join(cesiumSourcePath, 'Workers'), to: path.join(config.output.path, cesiumRunPath, 'Workers') },
        { from: path.join(cesiumSourcePath, 'Assets'), to: path.join(config.output.path, cesiumRunPath, 'Assets') },
        { from: path.join(cesiumSourcePath, 'ThirdParty'), to: path.join(config.output.path, cesiumRunPath, 'ThirdParty') },
        { from: path.join(cesiumSourcePath, 'Widgets'), to: path.join(config.output.path, cesiumRunPath, 'Widgets') }
      ])
    ]
    return {
      module: { unknownContextCritical: false }, // 配置加载的模块类型，cesium时必须配置
      plugins: plugins
    }
  }
}

//如果出错请替换上面的代码
// new CopyWebpackPlugin({
//   patterns: [
//     { from: path.join(cesiumSourcePath, 'Workers'), to: path.join(config.output.path, cesiumRunPath, 'Workers') },
//     { from: path.join(cesiumSourcePath, 'Assets'), to: path.join(config.output.path, cesiumRunPath, 'Assets') },
//     { from: path.join(cesiumSourcePath, 'ThirdParty'), to: path.join(config.output.path, cesiumRunPath, 'ThirdParty') },
//     { from: path.join(cesiumSourcePath, 'Widgets'), to: path.join(config.output.path, cesiumRunPath, 'Widgets') }
//   ]
// })
