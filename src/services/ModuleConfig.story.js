export default {
  title: '用法',
  desc: '默认用法',
  group: '平台服务',
  storyOf: '模块配置',
  story: 'usage',
  Api: {
    info: {
      desc: '<strong>class ModuleConfig(moduleName, configSchema, defaultConfig);</strong><br />根据json格式的处理数据转换配置，将数据做对应的数据转换。<br/>若在 <strong>window.moduleConfig[moduleName]</strong> 中有值，则使用该值，否则使用 <strong>defaultConfig</strong>',
    },
    properties: {
      moduleName: {
        showName: '模块名称',
        desc: '配置的模块名称, 一般一个module一个配置，配置项多时则将多个配置项合并成一个嵌套的配置',
        type: 'string',
        required: true,
      },
      configSchema: {
        showName: '配置结构',
        desc: '描述配置的内部结构，用于向开发人员展示当前模块的可配置方式，同时用于向UI界面提供配置模块的信息',
        type: 'json',
        required: true,
      },
      defaultConfig: {
        showName: '默认配置',
        desc: '默认的配置值',
        type: 'json',
        required: true,
      },
    },
  },
  code: `\
const ModuleConfig = platform.services.services.platform.ModuleConfig;

module.render = () => {
  // config:
  if (!window.moduleConfig) {
    window.moduleConfig = {};
  }
  window.moduleConfig.testModuleB = { idField: 'seqId' };

  // usage:
  const configA = new ModuleConfig('testModuleA', {
    idField: {
      title: 'id字段名',
      type: 'string',
      default: 'id',
    },
  }, {
    idField: 'id',
  });

  const configB = new ModuleConfig('testModuleB', {
    idField: {
      title: 'id字段名',
      type: 'string',
      default: 'id',
    },
  }, {
    idField: 'id',
  });

  // result:
  return 'testModuleA: ' + configA.get('idField') + '\\n' +
    'testModuleB: ' + configB.get('idField');
}
  `,
};
