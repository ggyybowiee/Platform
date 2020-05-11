import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';

platform.app.registerModule({
  name: 'user',
  info: {
    title: '用户系统',
    group: '系统类应用',
    symbol: 'USER',
    icon: require('../../assets/COMS.png'),
    version: '1.0.0',
    description: '用户管理',
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
