import React, { Component } from 'react';
import { Popover, Icon } from 'antd';
import {
  ResourceType, Resource,
  App, Module, Route, Element,
} from '../../../../classes/Resource.interface';
import { getResourceTypeName } from '../../../../utils';

export default ({
  title,
  node,
  activeAppHomePath,
  onDelete,
  onSetHome,
} : {
  title: string,
  node: Resource,
  activeAppHomePath: string,
  onDelete: Function,
  onSetHome: Function
}) => {
  let action;
  const isModule = node.type === ResourceType.Module;
  const isRoute = node.type === ResourceType.Route;
  if (isModule) {
    action = <Icon type="delete" onClick={() => onDelete(node)} />;
  } else if (isRoute && _.isEmpty((node as Route).children)) {
    action = <Icon type="home" title="设为home目录" onClick={() => onSetHome(node)} />;
  } else {
    return node.name;
  }

  const isHome = isRoute && activeAppHomePath === (node as Route).path;

  return (
    <Popover content={action} trigger="hover" placement="right">
      <span style={{ color: isHome ? '#1890ff' : '#333' }}>
        {title} {isHome ? '(主页)' : ''}
      </span>
    </Popover>
  );
};
