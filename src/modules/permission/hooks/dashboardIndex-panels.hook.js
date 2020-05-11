
const delayAsync = duration => new Promise(resolve => {
  setTimeout(resolve, duration);
});

platform.hooks.registerHook('dashboardIndex-panels', async panels => {
  let permissions;
  while (!permissions) {
    permissions = platform.app._store.getState().permissions.currentPermissions;
    await delayAsync(300);
  }

  return [
    _.map(panels, panel => ({
      ...panel,
      modules: _.filter(panel.modules, m => _.some(permissions, permission => (permission.resourceContent === m.name))),
    }))
  ];
});
