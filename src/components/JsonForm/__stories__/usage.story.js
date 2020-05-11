
export default {
  title: '用法',
  desc: '默认用法',
  group: '组件',
  storyOf: '超级表单',
  story: 'usage',
  apiGlobalPath: 'platform.components.JsonForm',
  code: `\
const {
  components: {
    JsonForm,
  },
} = platform;

module.render = () => (
  <JsonForm
    elements={[{
      id: 0,
      field: {
        name: 'a',
        label: 'A',
      },
      input: {
        type: 'string',
      },
    }]}
    formSetting={{}}
    layout={{ layout: 'grid', detail: [[0]] }}
    data={{}}
  />
)
  `,
};
