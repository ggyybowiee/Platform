// 在所有模块加载钱先初始化platform，使得可以在各文件import时添加自定义内容
window.platform = {};

import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import _ from 'lodash';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';
import services from './services';
// import modules from './modules';
import './utils/lodashMixins';
import * as hooks from './common/hooks';
import event from './common/event';

import './index.less';

const importAll = (r, isJustDefault = true) => {
  return _.chain(r.keys())
    .mapKeys(path => path.match(/\/(\w+)[/.]/) && path.match(/\/(\w+)[\/(\.js)]/)[1])
    .mapValues(key => isJustDefault ? r(key).default : r(key))
    .value();
};

const components = importAll(require.context('./components', true, /^\.\/\w+\/index\.js$/));
const layouts = importAll(require.context('./layouts', true, /index\.js$/));
const utils = importAll(require.context('./utils', false, /.+\.js$/), false);
// const services = importAll(require.context('./services', true));

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError: (error) => {
    console.error(error);
    return false;
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);
app.model(require('./models/module').default);
app.model(require('./models/dictionary').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

app.services = services;

window.app = app;
const vendorModules = {
  react: require('react'),
  reactDom: require('react-dom'),
  lodash: require('lodash'),
  fp: require('lodash/fp'),
  dva: require('dva'),
  dvaRouter: require('dva/router'),
  reactRouter: require('react-router'),
  antd: require('antd'),
  Cookies: require('js-cookie'),
  bizcharts: require('bizcharts'),
  DataSet: require('@antv/data-set'),
  bizchartsPluginSlider: require('bizcharts-plugin-slider'),
  echarts: require('echarts'),
  echartsForReact: require('echarts-for-react'),
  qs: require('qs'),
  lodashDecorators: require('lodash-decorators'),
  moment: require('moment'),
  reactToPrint: require('react-to-print'),
  rxjs: require('rxjs'),
  classnames: require('classnames'),
};

const registerModule = moduleToRegister => {
  return platform.app._store.dispatch({
    type: 'module/register',
    payload: moduleToRegister,
  });
};

window.platform = {
  ...window.platform,
  app,
  registerModule: registerModule,
  services,
  components,
  layouts,
  utils,
  hooks,
  event,
  vendor: vendorModules,
};

app.registerModule = registerModule;

app._store.dispatch({
  type: 'module/addGlobalFragments',
  payload: require('./fragments').default,
});

// 加载环境变量配置的模块，下面自动加载 ./modules/index.${env}.js
require('loadModule');


// loadModulesInUrlSearch();
export default app; // eslint-disable-line
