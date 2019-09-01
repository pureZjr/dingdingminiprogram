'use strict';

var path = require("../path");

var config = {
  projectName: 'tarodingdong',
  date: '2019-4-20',
  designWidth: 750,
  appid: 'wx13750ec250a0c16d',
  deviceRatio: {
    '640': 1.17,
    '750': 1,
    '828': 0.905
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [['env', {
        modules: false
      }]],
      plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread']
    },
    // 压缩js
    uglify: {
      enable: true,
      config: {
        // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
      }
    },
    // 压缩css
    csso: {
      enable: true,
      config: {
        // 配置项同 https://github.com/css/csso#minifysource-options
      }
    },
    // 配置全局scss
    sass: {
      resource: path.resolve(__dirname, '..', 'src/styles/app.scss'),
      projectDirectory: path.resolve(__dirname, '..')
    }
  },
  alias: {
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@constants': path.resolve(__dirname, '..', 'src/constants'),
    '@page': path.resolve(__dirname, '..', 'src/container/page'),
    '@shared': path.resolve(__dirname, '..', 'src/container/shared'),
    '@server': path.resolve(__dirname, '..', 'src/server'),
    '@store': path.resolve(__dirname, '..', 'src/store'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    '@utils': path.resolve(__dirname, '..', 'src/utils')
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
          }
        },
        pxtransform: {
          enable: true,
          config: {}
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
};

module.exports = function (merge) {
  {
    return merge({}, config, require("./dev.js"));
  }
  return merge({}, config, require("./prod.js"));
};