import app from 'app';
import menu from './menu';
import router from './router';
import models from './models';
import services from './services';
import './hooks';
import icon from '../../assets/COMS.png'

platform.app.registerModule({
  name: 'system',
  info: {
    title: '系统配置',
    group: '系统类应用',
    symbol: 'SYSTEM',
    version: '1.0.0',
    description: '系统配置，包括字典配置、医院信息设置和其他配置信息',
  },
  menu,
  routers: router,
  models,
  services,
});
