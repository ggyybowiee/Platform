import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

export default ({ node, activeAppHomePath, onDelete, onSetHome }) => {
  let action;
  if (node.source.resourceType == '2') {
    action = <Icon type="delete" onClick={() => onDelete(node)} />;
  } else if (_.isEmpty(node.children)) {
    action = <Icon type="home" title="设为home目录" onClick={() => onSetHome(node)} />;
  } else {
    return node.title;
  }

  const isHome = activeAppHomePath === node.path;

  return (
    <Popover content={action} trigger="hover" placement="right">
      <span style={{ color: isHome ? '#1890ff' : '#333' }}>
        {node.title} {isHome ? '(主页)' : ''}
      </span>
    </Popover>
  );
};
