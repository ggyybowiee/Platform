export default {
  title: '用法',
  desc: '默认用法',
  group: '平台服务',
  storyOf: '数据转换',
  story: 'usage',
  Api: {
    info: {
      desc: '<strong>dataTransform => data => data </strong><br />根据json格式的处理数据转换配置，将数据做对应的数据转换',
    },
    properties: {
      transformConfig: {
        showName: '转换配置',
        desc: '转换步骤的json对象配置',
        type: 'Array<{type: string/func, args: array<any>}>',
        required: true,
      },
      data: {
        showName: '需要转换的数据',
        desc: '需要转换的数据',
        type: 'any',
        required: true,
      },
    },
  },
  code: `\
const dataTransform = platform.services.services.platform.dataTransform;

module.render = () => {
  const transformConfig = [{
    type: 'map', args: [(v) => (v + '---' + v)],
  }, {
    type: 'join', args: [', '],
  }];
  const data = [1,2,3,4,5];
  return dataTransform(transformConfig)(data);
}
  `,
};
