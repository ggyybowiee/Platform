import ModuleConfig from 'services/ModuleConfig';

export default new ModuleConfig('message', {
  messageTranform: {
    title: '消息格式化',
    type: 'function',
    desc: '转换接收到的消息为系统消息格式，系统消息格式：{ id, avatar, title, datetime, type, code }',
  },
}, {
  // messageTranform: (msg) => ({
  //   id: '000000002',
  //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
  //   title: '你推荐的 曲妮妮 已通过第三轮面试',
  //   datetime: '2017-08-08',
  //   type: '通知',
  //   code: 'notify',
  // }),
});
