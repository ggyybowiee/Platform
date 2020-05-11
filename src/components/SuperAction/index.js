import React from 'react';
import { Popconfirm, Icon } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import actions from './actions';

const SuperAction = ({ type, onTrigger, ...otherProps }) => {
  const Action = actions[type];
  if (!Action) {
    return <span style={{ color: 'red' }}>不支持的action类型</span>;
  }

  return (
    <Action onTrigger={onTrigger} className={styles.iconOperation} {...otherProps} />
  );
};

SuperAction.ActionsGroup = ({ actions, className, inline = false, overflow = false, children }) => (
  <div className={classnames(styles.container, className, { [styles.inline]: inline, [styles.overflow]: overflow })}>
    {children}
    <div className={styles.operations}>
      {
        _.map(actions, (configOrHandler, type) => {
          if (_.isFunction(configOrHandler)) {
            return (<SuperAction key={type} type={type} onTrigger={configOrHandler} />);
          }
          return (<SuperAction key={configOrHandler.id} type={type} {...configOrHandler} />);
        })
      }
    </div>
  </div>
);

export default SuperAction;
