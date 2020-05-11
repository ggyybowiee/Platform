import React from 'react';
import { Link } from 'dva/router';
import _ from 'lodash';
import PageHeader from '../../components/PageHeader';
import styles from './index.less';

const isEmpty = (props) => {
  const keys = _.keys(props);

  if (keys.length === 0) {
    return true;
  }

  return _.every(keys, key => _.isNil(props[key]) || _.isEmpty(props[key]));
};

const PageHeaderLayout = ({ children, wrapperClassName, top, ...restProps }) => console.log('restProps', restProps) || (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);

PageHeaderLayout.info = {
  desc: '带默认头部布局，页头包括面包屑、页面标题、tab标签页、操作等，更多可以查看Api或PageHeader的Api',
};

PageHeaderLayout.properties = {
  top: {
    showName: '顶部内容',
    desc: '在标题及面包屑以前的内容',
    type: 'ReactElement/string',
  },
  wrapperClassName: {
    showName: '容器css类名',
    desc: '设置容器的样式类',
    type: 'string',
  },
  ...(PageHeader.properties || {}),
};

export default PageHeaderLayout;
