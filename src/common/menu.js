import _ from 'lodash';
import { isUrl } from '../utils/utils';

const menuData = [
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   // 路由权限，只有角色匹配时才显示该菜单，缺省值则都显示
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //   ],
  // },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };

    if (item.children) {
      result.children = formatter(item.children, item.path ? `${parentPath}${item.path}/` : parentPath, item.authority);
    }
    return result;
  });
}

export {
  formatter as formatterMenuConfig,
  menuData as defaultMenu,
};

export const getMenuData = () => formatter(menuData);
