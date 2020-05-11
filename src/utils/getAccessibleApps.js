import _ from 'lodash';

export default function getAccessibleApps(apps = [], loadedModules = {}) {
  const appCode = _.get(apps, '[0].code');
  const currentAppAccessableModule = _.chain(apps)
    .find(item => item.code === appCode)
    .get('modules')
    .filter(item => loadedModules[item.code])
    .value();

  const getHomePath = () => {
    const app = _.find(apps, { code: appCode });
    const isValidHomePath = _.find(currentAppAccessableModule, item => _.find(item.routes, { path: app.homePath }));

    if (isValidHomePath) {
      return app.homePath;
    }

    return _.get(currentAppAccessableModule, '[0].routes[0].path');
  }

  if (!_.isEmpty(currentAppAccessableModule)) {
    return {
      code: appCode,
      homePath: getHomePath(),
    };
  }

  const restApps = _.filter(apps, item => item.code !== appCode);

  for (let i = 0; i < restApps.length; i += 1) {
    const found = getAccessibleApps(restApps, loadedModules);

    if (found) {
      return found;
    }
  }

  return null;
}
