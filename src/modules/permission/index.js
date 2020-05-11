import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';
import formatters from './formatters';
import fragments from './fragments';
import './hooks';

platform.app.registerModule({
  name: 'permission',
  info: {
    title: '权限系统',
    group: '系统类应用',
    symbol: 'PERMISSION',
    icon: require('../../assets/COMS.png'),
    version: '1.0.0',
    description: '权限管理',
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
  formatters,
  fragments,
});
