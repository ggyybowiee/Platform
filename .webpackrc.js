const path = require('path');
const _ =  require('lodash');
const modules = require('./.modules.conf.js');

function resolvePckDependences() {
  const pck = require('./package.json');
  return _.chain(pck.dependencies)
    .keys()
    .difference(['babel-runtime', 'react', 'react-dom', 'moment', 'antd'])
    .value();
}

const BUILD_TYPE_MAP = {
  'otherwise': 'src/index.js',
  'app-dll': { app: ['./src/index.js'] },
  'module-build': 'src/loadModule.js',
  'modules-build': modules,
  'module-dev': path.join(process.env.NODE_BUILD_MODULE_PATH || '', 'src/index.js'),//'src/loadModule.js',
  'modules-dev': require('./.modules.conf'), //'src/loadModules.js',
  'vendor-dll': {
    vendor: resolvePckDependences()
  }
};

const HTML_TEMPLATE_MAP = {
  'vendor-dll': {
    template: './src/index.ejs',
    filename: '../../../src/vendor.ejs',
  },
  'app-dll': {
    template: './src/vendor.ejs',
    filename: '../../../src/app.ejs',
  },
  'module-dev': {
    template: './src/app.ejs',
  },
  'module-build': {
    template: './src/app.ejs',
  },
  'modules-dev': {
    template: './src/app.ejs',
  },
  'modules-build': {
    template: './src/app.ejs',
  },
  'otherwise': {
    template: './src/vendor.ejs',
  },
};

const PUBLIC_PATH_MAP = {
  'app-dll': '/dll/app/',
  'vendor-dll': '/dll/vendor/',
  'otherwise': '/',
};

const PROXY_MAP = {
  '/api/scaffold': {
    target: 'http://127.0.0.1:8011',
    changeOrigin: true,
    pathRewrite: {'^/api/scaffold': '/'}
  },
  '/api/transformCode': {
    target: 'http://127.0.0.1:8090',
    changeOrigin: true,
    pathRewrite: {'^/api/transformEsCode': '/'}
  },
  '/api/icons': {
    target: 'http://127.0.0.1:8091',
    changeOrigin: true,
    pathRewrite: {'^/api/icons': '/'}
  },
  '/api/auth': {
    target: 'http://10.2.3.140:10480',
    changeOrigin: true,
    pathRewrite: {'^/api/auth': '/WRMSFoundationFD'}
  },
  '/api/sys': {
    target: 'http://10.2.3.140:10480/',
    changeOrigin: true,
    pathRewrite: {'^/api/sys': '/WRMSFoundationFD'}
  },
  // '/api/sys': {
  //   target: 'http://10.2.13.185:10381/',
  //   changeOrigin: true,
  //   pathRewrite: { '^/api/sys': '/WRMSFoundation' }
  // },
  '/api/infusion': {
    target: 'http://10.2.3.119:8080/',
    changeOrigin: true,
    pathRewrite: { '^/api/infusion': '/infusion' }
  },
  '/ws/sys': {
    target: 'ws://10.2.3.140:10480/',
    changeOrigin: true,
    pathRewrite: { '^/ws/sys': '/WRMSFoundationFD/sys' },
    ws: true,
    secure: false,
    logLevel: 'debug',
  },
  '/ws/ldm': {
    target: 'ws://10.2.3.140:10385/',
    changeOrigin: true,
    pathRewrite: { '^/ws/ldm': '/WRMSLdm' },
    ws: true,
    secure: false,
    logLevel: 'debug',
  },
  // 药柜
  '/api/pharmAUX': {
    target: 'http://10.2.3.140:10388/',
    // target: 'http://10.2.3.140:10388/',
    changeOrigin: true,
    pathRewrite: {'^/api/pharmAUX': '/WRMSPharmAUX'}
  },
  // 医院云端
  '/api/hosCloud': {
    target: 'http://10.2.3.140:10390/',
    changeOrigin: true,
    pathRewrite: {'^/api/hosCloud': '/WRMSHospitalCloud'}
  },
  // 医院
  '/api/hospital': {
    target: 'http://10.2.3.140:10480/',
    changeOrigin: true,
    pathRewrite: {'^/api/hospital': '/WRMSFoundationFD'}
  },
  // LDM
  '/api/ldm': {
    target: 'http://10.2.3.140:10385/',
    changeOrigin: true,
    pathRewrite: {'^/api/ldm': '/WRMSLdm'}
  },
  // LDM云端
  '/api/ldmCloud': {
    target: 'http://10.2.3.140:10389',
    // target: 'http://10.2.3.132:10389',
    // target: 'http://10.2.3.132:10389',
    changeOrigin: true,
    pathRewrite: {'^/api/ldmCloud': '/WRMSLdmCloud'}
  },
  '/api/smartWard': {
    target: 'http://10.2.3.140:10387',
    changeOrigin: true,
    pathRewrite: { '^/api/smartWard': '/WRMSSmartWard' }
  },
  '/ITAC': {
    target: 'http://10.2.13.74:10381',
    changeOrigin: true
  },
  '/api/emr': {
    target: 'http://10.2.3.140:10383/',
    changeOrigin: true,
    pathRewrite: { '^/api/emr': '/WRMSEmr' }
  },
  '/api/windranger': {
    target: 'http://10.2.3.140:9099/',
    // target: 'http://10.2.3.140:10383/',
    changeOrigin: true,
    pathRewrite: { '^/api/windranger': '/windranger' }
  },
};

const ALIAS_MAP = {
  'otherwise': {
    app: path.resolve(__dirname, 'src/index.js'),
    components: path.resolve(__dirname, 'src/components/'),
    layouts: path.resolve(__dirname, 'src/layouts/'),
    services: path.resolve(__dirname, 'src/services/'),
    utils: path.resolve(__dirname, 'src/utils/'),
  },
  'module-dev': {},
  'module-build': {},
  'modules-dev': {},
  'modules-build': {},
  'vendor-dll': {},
};

const EXTERNALS_MAP = {
  'otherwise': {
    'antd': 'window.antd',
    'moment': 'window.moment',
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  'vendor-dll': {
    'antd': 'window.antd',
    'moment': 'window.moment',
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  'module-dev': {
    "react": "window.platform.vendor.react",
    "platform": "window.platform",
    "app": "window.platform.app",
    "components": "window.platform.components",
    "services": "window.platform.services.services",
    "utils": "window.platform.utils",
    "layouts": "window.platform.layouts"
  },
  'modules-dev': {
    "react": "window.platform.vendor.react",
    "platform": "window.platform",
    "app": "window.platform.app",
    "components": "window.platform.components",
    "services": "window.platform.services.services",
    "utils": "window.platform.utils",
    "layouts": "window.platform.layouts"
  },
  'module-build': {
    "react": "window.platform.vendor.react",
    "platform": "window.platform",
    "app": "window.platform.app",
    "components": "window.platform.components",
    "services": "window.platform.services.services",
    "utils": "window.platform.utils",
    "layouts": "window.platform.layouts"
  },
  'modules-build': {
    "react": "window.platform.vendor.react",
    "platform": "window.platform",
    "app": "window.platform.app",
    "components": "window.platform.components",
    "services": "window.platform.services.services",
    "utils": "window.platform.utils",
    "layouts": "window.platform.layouts"
  },
};

console.log('entry => ', BUILD_TYPE_MAP[process.env.NODE_BUILD_TYPE]);

module.exports = {
  entry: BUILD_TYPE_MAP[process.env.NODE_BUILD_TYPE] || BUILD_TYPE_MAP.otherwise,
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  extraBabelIncludes: [
    "node_modules/gl-matrix",
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    ...(ALIAS_MAP[process.env.NODE_BUILD_TYPE] || ALIAS_MAP['otherwise']),
    loadModule: path.join(__dirname, `src/modules/index.${process.env.NODE_ENV}.js`),
    iconfont: path.join(__dirname, './iconfont'),
  },
  ignoreMomentLocale: true,
  theme: require('./src/theme.js'),
  html: HTML_TEMPLATE_MAP[process.env.NODE_BUILD_TYPE] || HTML_TEMPLATE_MAP.otherwise,
  disableDynamicImport: true,
  publicPath: PUBLIC_PATH_MAP[process.env.NODE_BUILD_TYPE] || PUBLIC_PATH_MAP.otherwise,
  hash: true,
  proxy: PROXY_MAP,
  define: {
    'process.env.NODE_BUILD_MODULE_PATH': path.join('..', process.env.NODE_BUILD_MODULE_PATH || '', 'src/index.js'),
    'process.env.PLATFORM_EXCLUDE_MODULES': process.env.PLATFORM_EXCLUDE_MODULES,
    'process.env.PLATFORM_DIR': path.resolve(__dirname),
  },
  externals: EXTERNALS_MAP[process.env.NODE_BUILD_TYPE] || EXTERNALS_MAP.otherwise,
};
