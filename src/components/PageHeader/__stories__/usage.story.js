export default {
  title: '用法',
  desc: '默认用法',
  group: '组件',
  storyOf: '页头',
  story: 'usage',
  apiGlobalPath: 'platform.components.PageHeader',
  code: `\
const {
  vendor: {
    antd: { Icon },
  },
  components: {
    PageHeader,
  },
} = platform;

module.render = () => (
  <PageHeader title="页面标题" content="hello" extraContent="world" logo={(<Icon type="logout" />)} action={<button>logout</button>} tabList={[{tab: 'AAA', key: 'AAA'}, {tab: 'BBB', key: 'BBB'}]} tabBarExtraContent="ssss">
    ...body
  </PageHeader>
)
  `,
};
