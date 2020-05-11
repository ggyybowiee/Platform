
export default {
  title: '用法',
  desc: '默认用法',
  group: '布局',
  storyOf: '带页头布局',
  story: 'usage',
  apiGlobalPath: 'platform.components.PageHeaderLayout',
  code: `\
const {
  vendor: {
    antd: { Icon },
  },
  layouts: {
    PageHeaderLayout,
  },
} = platform;

module.render = () => (
  <PageHeaderLayout title="页面标题" content="hello" extraContent="world" logo={(<Icon type="logout" />)} action={<button>logout</button>} tabList={[{tab: 'AAA', key: 'AAA'}, {tab: 'BBB', key: 'BBB'}]} tabBarExtraContent="ssss">
    ...body
  </PageHeaderLayout>
)
  `,
};
