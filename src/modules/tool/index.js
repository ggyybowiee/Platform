import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';
import fragments from './fragments';
import icon from '../../assets/COMS.png'

platform.app.registerModule({
  name: 'tool',
  info: {
    title: '工具系统',
    group: '开发类应用',
    symbol: 'TOOL',
    version: '1.0.0',
    // icon: icon,
    description: '工具系统',
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
