import _ from 'lodash';
import { get } from 'lodash/fp';
import moment from 'moment';
import { formatterMenuConfig, defaultMenu } from '../common/menu';
import { getRouterData } from '../common/router';
import wrapModuleRoute from '../common/wrapModuleRoute';
import { callHooks } from '../common/hooks';
import formatterService from '../services/formatter';
import { loadModulesInUrlSearch, loadModuleFromHub } from '../services/module';
import getAccessibleApps from '../utils/getAccessibleApps';

const getTreeChildren = (data) => {
  const children = _.chain(data).map('modules').flatten().map('routes').flatten().value();
  const getDeep = (routes) => {
    return _.map(routes, (item) => {
      if (!_.isEmpty(item.children)) {
        return getDeep(item.children);
      }

      return item.path.replace(/^(\/\w*){1}/g, '');
    });
  }

  return _.flattenDeep(getDeep(children));
}

export default {
  namespace: 'module',

  state: {
    sourceMenu: defaultMenu,
    menu: formatterMenuConfig(defaultMenu),
    routers: {},
    loadedModules: {},
    currentModule: null,
    fragments: {},
    pageFragments: {},
    currentMenu: [],
    waitingDependenciesModules: [],
    modulesLoadInfoMap: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      setTimeout(() => {
        if (!window.platform) {
          history.push('/home');

          window.location.reload();
          return;
        }

        dispatch({
          type: 'watchAppsChange',
        });
        dispatch({
          type: 'refreshCurrentMenu',
        });
        dispatch({
          type: 'loadModulesInUrlSearch',
        });

        platform.event.subscribe('moduleLoaded', () => {
          dispatch({ type: 'retryRegisterWaitingModules' });
        });
      }, 0);
    },
  },

  effects: {
    *watchAppsChange(state, { select, put, take }) {
      while (true) {
        const { payload: apps } = yield take('global/setApps');
        const loadedModules = yield select(state => _.get(state, 'module.loadedModules'));
        const modules = _.chain(apps)
          .map('modules')
          .flatten()
          .value();

        _.chain(modules)
          .map('code')
          .difference(_.keys(loadedModules))
          .forEach(loadModuleFromHub)
          .value();
      }
    },

    *register({ payload: moduleDefine }, { select, put }) {
      const { name: moduleName, dependecies } = moduleDefine;
      if (yield select(get(`module.loadedModules[${moduleName}]`))) {
        console.error(`Module ${moduleName} already loaded!`);
        return;
      }

      const loadedModules = yield select(get('module.loadedModules'));
      const lackDependecies = _.filter(dependecies, dependecyModuleName => !loadedModules[dependecyModuleName]);

      if (!_.isEmpty(lackDependecies)) {
        yield put({
          type: 'pushWaitingDependenciesModule',
          payload: moduleDefine,
        });

        console.log('push');

        const modulesLoadInfoMap = yield select(get('module.modulesLoadInfoMap'));

        const newModulesLoadInfoMap = _.chain(lackDependecies)
          .reject(d => modulesLoadInfoMap[d])
          .map(dependence => {
            return {
              name: dependence,
              loadType: 'url',
              loadLocationType: 'hub',
              loadLocation: dependence,
              ...loadModuleFromHub(dependence),
            };
          })
          .mapKeys('name')
          .value();

        yield put({
          type: 'addModulesLoadInfoMap',
          payload: newModulesLoadInfoMap,
        });

        return;
      }

      yield put({
        type: 'doRegister',
        payload: moduleDefine
      });

      // 等待状态更新后再触发事件
      setTimeout(() => {
        platform.event.emmit({ type: 'moduleLoaded', value: moduleName });
      }, 0);
    },

    *doRegister({ payload: moduleDefine }, { select, put }) {
      const { name: moduleName, menu, routers, models, services, info, formatters, dependecies } = moduleDefine;
      const loadedModules = yield select(get('module.loadedModules'));

      if (loadedModules[moduleName]) {
        console.error(`Module ${moduleName} already loaded!`);
        return;
      }

      if (models) {
        _.forEach(models, model => {
          window.platform.app.model(model.default || model);
        });
      }

      if (services) {
        window.platform.app.services.register(moduleName, services);
      }

      if (formatters) {
        _.forEach(formatters, formatterService.register);
      }

      yield put({
        type: 'addLoadedModule',
        payload: moduleDefine,
      });

      // 最后一次加载module再setAccessible
      const modulesLoadInfoMap = yield select(get('module.modulesLoadInfoMap'));
      const newModules = {
        ...loadedModules,
        [moduleName]: moduleDefine,
      };
      const apps = yield select(state => _.get(state, 'permissions.currentPermissions'));

      if (_.get(modulesLoadInfoMap, moduleDefine.name)) {
        yield put({
          type: 'permissions/setAccessibleApp',
          payload: getAccessibleApps(apps, newModules),
        });
      }

      yield put({
        type: 'addMenu',
        payload: menu,
      });

      yield put({
        type: 'addRouters',
        payload: _.chain(routers)
          .mapKeys((router, path) => `/:app/:layout${path}`)
          .mapValues((route, fullPath) => ({
            ...route,
            component: wrapModuleRoute(route.component, moduleName),
          }))
          .value(),
      });

      yield put({
        type: 'addGlobalFragments',
        payload: moduleDefine.fragments,
      });

      yield put({
        type: 'refreshCurrentMenu',
      });
    },

    *refreshCurrentMenu(action, { select, call, put }) {
      const app = yield select(get('global.app'));
      const menu = yield select(get('module.menu'));

      const [ currentMenu ] = yield call(callHooks, 'currentMenu', menu, app);

      const currentPermissions = yield select(state => _.get(state, 'permissions.currentPermissions'));

      const currentModules = _.chain(currentPermissions).find({ code: app }).get('modules').value();

      const newMenu = _.map(currentMenu, ({ path, ...restProps }) => {
        const correctModule = _.find(currentModules, { path });

        return {
          ...restProps,
          path,
          ..._.omit(correctModule, 'routes'),
          children: _.get(correctModule, 'routes'),
        };
      });

      const existRouters = yield select(state => _.get(state, 'module.routers'));
      const flattenedPermissions = getTreeChildren(currentPermissions);

      yield put({
        type: 'addRouters',
        payload: _.mapValues(existRouters, (route, fullPath) => ({
          ...route,
          // TODO: exact 页面子路由权限判定
          isAuthorized: _.isEmpty(flattenedPermissions) ? true : (_.isBoolean(route.exact) && !route.exact ? true : _.includes(flattenedPermissions, fullPath.replace('/:app/:layout', ''))),
          authority: () => _.isEmpty(flattenedPermissions) ? true : (_.isBoolean(route.exact) && !route.exact ? true : _.includes(flattenedPermissions, fullPath.replace('/:app/:layout', ''))),
        })),
      });

      yield put({
        type: 'setCurrentMenuFromServer',
        payload: newMenu,
      });

      yield put({
        type: 'setCurrentMenu',
        payload: currentMenu,
      });
    },

    *retryRegisterWaitingModules(action, { select, call, put }) {
      const waitingModules = yield select(get('module.waitingDependenciesModules'));
      let newLoadedModules = [];
      let i = 0;
      let tmpModule = waitingModules[i++];

      function *isDependeciesLoaded(dependecies) {
        const loadedModules = yield select(get('module.loadedModules'));
        return _.every(dependecies, dependecyModuleName => loadedModules[dependecyModuleName]);
      }

      while (tmpModule) {
        if (yield isDependeciesLoaded(tmpModule.dependecies)) {
          yield put({
            type: 'doRegister',
            payload: tmpModule,
          });

          newLoadedModules.push(tmpModule);
        }

        tmpModule = waitingModules[i++];
      }

      if (_.isEmpty(newLoadedModules)) {
        return;
      }

      yield put({
        type: 'setWaitingDependeciesModules',
        payload: _.difference(waitingModules, newLoadedModules),
      });

      setTimeout(() => {
        platform.event.emmit({
          type: 'moduleLoaded',
          value: _.chain(newLoadedModules)
            .map('name')
            .join(',')
            .value(),
        });
      }, 0);
    },

    *loadModulesInUrlSearch(action, { select, call, put }) {
      const modulesLoadInfoMap = loadModulesInUrlSearch();

      yield put({
        type: 'setModulesLoadInfo',
        payload: modulesLoadInfoMap,
      });
    },
  },

  reducers: {
    addMenu(state, { payload: menu }) {
      const sourceMenu = state.sourceMenu.concat(menu);
      return { ...state, sourceMenu, menu: formatterMenuConfig(sourceMenu) };
    },

    addRouters(state, { payload: newRouters }) {
      console.info('%c 新注册路由：', 'background: #f6ffed; border: 1px solid #b7eb8f; color: #555', newRouters);

      if (window.loadTime) {
        console.log('%c Module加载时间：', 'background: #f6ffed; border: 1px solid #b7eb8f; color: #555', moment().diff(window.loadTime));
      }

      window.loadTime = moment();
      const routers = _.assign({}, state.routers, newRouters);
      return { ...state, routers };
    },

    addLoadedModule(state, { payload: moduleDefine }) {
      return { ...state, loadedModules: { ...state.loadedModules, [moduleDefine.name]: moduleDefine } };
    },

    turnCurrentModule(state, { payload: moduleName }) {
      return {
        ...state,
        currentModule: state.loadedModules[moduleName],
      };
    },

    addGlobalFragments(state, { payload: newGlobalfragments }) {
      const globalFragments = composeFragments(state.globalFragments, newGlobalfragments, 'global');
      return {
        ...state,
        globalFragments,
        fragments: composeFragments(globalFragments, state.pageFragments),
      };
    },

    addModulesLoadInfoMap(state, { payload: newModuleInfos }) {
      return { ...state, modulesLoadInfoMap: { ...state.modulesLoadInfoMap, ...newModuleInfos } }
    },

    setPageFragments(state, { payload: { moduleName, newPageFragments } }) {
      const moduleDefine = state.loadedModules[moduleName];
      const moduleFragments = moduleDefine && moduleDefine.fragments;
      const pageFragments = composeFragments(moduleFragments, newPageFragments, 'module');
      return {
        ...state,
        pageFragments,
        fragments: composeFragments(state.globalFragments, pageFragments),
      };
    },

    setCurrentMenu(state, { payload: currentMenu }) {
      return { ...state, currentMenu }
    },

    setCurrentMenuFromServer(state, { payload: currentMenuFromServer }) {
      return { ...state, currentMenuFromServer }
    },

    setWaitingDependeciesModules(state, { payload: waitingDependenciesModules }) {
      return { ...state, waitingDependenciesModules };
    },

    pushWaitingDependenciesModule(state, { payload: moduleDefine }) {
      return { ...state, waitingDependenciesModules: [ ...state.waitingDependenciesModules, moduleDefine ] };
    },

    setModulesLoadInfo(state, { payload: modulesLoadInfoMap }) {
      return {
        ...state,
        modulesLoadInfoMap,
      };
    },
  },
};

function composeFragments(fragmentsA, fragmentsB, scope) {
  return _.chain(_.keys({ ...fragmentsA, ...fragmentsB }))
    .mapKeys(_.identity)
    .mapValues(key => {
      let partialFragments = [];
      if (fragmentsA && fragmentsA[key]) {
        partialFragments = partialFragments.concat(
          filterFragments(fragmentsA[key], scope)
        );
      }
      if (fragmentsB && fragmentsB[key]) {
        partialFragments = partialFragments.concat(
          filterFragments(fragmentsB[key], scope)
        );
      }
      return partialFragments;
    })
    .value();
}

function filterFragments(fragments, scope) {
  if (!scope) {
    return fragments;
  }

  return _.filter(fragments, ({ scope: fragmentScope = 'global' }) => (scope === fragmentScope));
}
