import _ from 'lodash';

const hooksType = {};
const hooksMap = {};

// TODO: remove after debug platform
window.hooksType = hooksType;
window.hooksMap = hooksMap;

export async function callHooks(hookName, ...args) {
  const hooks = hooksMap[hookName];
  if (_.isEmpty(hooks)) {
    return args;
  }

  let tmpArgs = args;
  for (let i = 0, { length } = hooks || []; i < length; i += 1) {
    tmpArgs = await hooks[i](...tmpArgs);
  }
  return tmpArgs;
}

export function regsiterHooksType(hooksName, desc) {
  if (hooksType[hooksName]) {
    console.error('钩子类型已经被注册:', hooksName);
    return;
  }
  hooksType[hooksName] = desc;
}

export function registerHook(hooksName, hook) {
  if (!hooksMap[hooksName]) {
    hooksMap[hooksName] = [];
  }
  hooksMap[hooksName].push(hook);
}

hooksMap._callHooks = callHooks;

hooksMap._regsiterHooksType = regsiterHooksType;

hooksMap._register = registerHook;

export default hooksMap;
