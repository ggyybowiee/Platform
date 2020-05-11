import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';
import fragments from './fragments';
import './hooks';
import './events';

platform.app.registerModule({
  name: 'auth',
  info: {
    title: '验证系统',
    group: '架构类应用',
    symbol: 'AUTH',
    icon: require('../../assets/COMS.png'),
    version: '1.0.0',
    description: '登录、权限、用户管理',
    hide: true,
    layout: 'blank',
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
  fragments,
});
