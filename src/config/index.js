import ModuleConfig from '../services/ModuleConfig';
import logo from '../assets/logo.png';

export default new ModuleConfig('platform', [
  {
    info: {
      title: '文档标题前缀',
      desc: '显示在浏览器标签页上的标题的前缀，最终浏览器标签页的标题为`${前缀} ${页面标题}`',
    },
    field: {
      name: 'documentTitlePrefix',
      label: '文档标题前缀',
    },
    input: {
      type: 'string',
    },
  },
  {
    info: {
      title: '网站名',
      desc: '后台管理的网站名称',
    },
    field: {
      name: 'siteName',
      label: '网站名',
    },
    input: {
      type: 'string',
    },
  },
  {
    info: {
      title: '网站标语',
      desc: '网站标语',
    },
    field: {
      name: 'siteShotIntro',
      label: '网站标语',
    },
    input: {
      type: 'string',
    },
  },
  {
    info: {
      title: 'logo',
      desc: '',
    },
    field: {
      name: 'logo',
      label: 'logo',
    },
    input: {
      type: 'string',
    },
  },
  {
    info: {
      title: '底部链接',
      desc: '',
    },
    field: {
      name: 'footerLinks',
      label: '底部链接',
    },
    input: {
      type: 'string',
    },
  },
  {
    info: {
      title: '版权',
      desc: '版权声明',
    },
    field: {
      name: '版权',
      label: '',
    },
    input: {
      type: 'string',
    },
  },
], {
  documentTitlePrefix: '联新',
  siteName: '联新智慧医院平台',
  siteShotIntro: '联接无界·以智赋能',
  logo,
  footerLinks: [{
    key: 'official_site',
    title: '联新官网',
    href: 'http://www.lachesis-mh.cn/',
    blankTarget: true,
  }],
  copyright: {
    year: '2018',
    owner: '深圳市联新移动医疗科技有限公司 All Rights Reserved',
  },
  appSwitchType: 'dropDown'
});
