import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';
import fragments from './fragments';
import config from './config';

platform.app.registerModule({
  name: 'message',
  info: {
    title: '消息系统',
    group: '架构类应用',
    symbol: 'MESSAGE',
    version: '1.0.0',
    // description: '处理消息通知',
    // icon: require('../../assets/COMS.png'),
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
  config,
});
