import _ from 'lodash';
import qs from 'qs';

const getModulesHubConfig = () => window.hubModulesConfigMap;
const getModuleConfigFromHub = (moduleName) => {
  const moduleConfig = _.get(getModulesHubConfig(), moduleName);

  if (!moduleConfig) {
    return {
      script: `/modules/${moduleName}/index.js`,
      css: `/modules/${moduleName}/index.css`,
    };
  }
  // 绝对路径
  const isUrl = url =>
    _.startsWith(url, '/')
    || _.startsWith(url, './')
    || _.startsWith(url, 'http://')
    || _.startsWith(url, 'https://');

  const resolveUrl = urlOrFileName =>
    isUrl(urlOrFileName)
    ? urlOrFileName
    : `/modules/${moduleName}/${urlOrFileName}`;

  return {
    ...moduleConfig,
    script: moduleConfig.script && resolveUrl(moduleConfig.script),
    css: moduleConfig.css && resolveUrl(moduleConfig.css),
  };
}

const createJsTag = path => {
  const jsTag = document.createElement('script');
  jsTag.src = path;
  return jsTag;
};

const createCssTag = path => {
  const cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.href = path;
  return cssTag;
};

export const loadModuleFromHub = moduleName => {
  const moduleConfig = getModuleConfigFromHub(moduleName);

  document.body.appendChild(createJsTag(moduleConfig.script));
  moduleConfig.css && document.body.appendChild(createCssTag(moduleConfig.css));
  return moduleConfig;
};

export const loadModuleFromUrl = moduleUrl => {
  document.body.appendChild(createJsTag(moduleUrl));
  // document.body.appendChild(createCssTag(moduleCssPath));
};

export const loadModulesInUrlSearch = () => {
  const modulesQueryStr = qs.parse(location.search.substr(1)).modules;

  console.log('modulesQueryStr', modulesQueryStr);

  if (!modulesQueryStr) {
    return;
  }

  const modules = modulesQueryStr.split(',');

  return _.chain(modules)
    .map((m) => {
      const moduleNameOrUrl = decodeURIComponent(m);
      const urlTypeModuleMatchArr = moduleNameOrUrl.match(/([^\[]+)\[\[([^\]]+)\]\]/);
      if (urlTypeModuleMatchArr) {
        loadModuleFromUrl(urlTypeModuleMatchArr[2]);
        return {
          name: urlTypeModuleMatchArr[1],
          loadType: 'url',
          loadLocationType: 'url',
          loadLocation: urlTypeModuleMatchArr[2],
        };
      } else {
        loadModuleFromHub(moduleNameOrUrl);
        return {
          name: moduleNameOrUrl,
          loadType: 'url',
          loadLocationType: 'hub',
          loadLocation: moduleNameOrUrl,
        };
      }
    })
    .mapKeys('name')
    .value();
};
