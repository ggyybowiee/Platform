import { createElement } from 'react';
import dynamic from 'dva/dynamic';

import Exception403 from '../routes/Exception/403';
import Exception404 from '../routes/Exception/404';
import Exception500 from '../routes/Exception/500';

export default {
  // '/result/success': {
  //   component: dynamicWrapper(platform.app, [], () => import('../routes/Result/Success')),
  // },
  // '/result/fail': {
  //   component: dynamicWrapper(platform.app, [], () => import('../routes/Result/Error')),
  // },
  '/exception/403': {
    component: Exception403,
  },
  '/exception/404': {
    component: Exception404,
  },
  '/exception/500': {
    component: Exception500,
  },
};
