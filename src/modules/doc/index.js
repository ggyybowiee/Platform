import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';

platform.app.registerModule({
  name: 'doc',
  info: {
    title: '开发文档',
    group: '开发类应用',
    symbol: '开发文档',
    icon: require('../../assets/COMS.png'),
    version: '1.0.0',
    description: '组件的API和其他说明性文档',
    // Comp: ({ info }) => (
    //   <div>
    //     {info.title}
    //   </div>
    // )
  },
  menu,
  routers: router,
  models,
  services,
});
