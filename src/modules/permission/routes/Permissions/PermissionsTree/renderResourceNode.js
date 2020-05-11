import React from 'react';
import { Tree, Icon } from 'antd';
import NodeTitle from './NodeTitle';
import AppModuleTitle from './AppModuleTitle';

const renderResourceNode = ({ node, activeApp, isActiveAllModules, createNodeActions, setAppHomeRoute, handleRemoveModuleFromApp }) => (
  <Tree.TreeNode
    key={node.key}
    title={(
      isActiveAllModules
      ? <NodeTitle node={node} {...createNodeActions(node)} />
      : <AppModuleTitle node={node} onDelete={handleRemoveModuleFromApp} onSetHome={setAppHomeRoute} activeAppHomePath={activeApp && activeApp.homePath} />
    )}
    icon={<Icon type={node.icon || node.content} />}
  >
    {node.children}
    {
      _.map(node.elements, elt => renderResourceNode({
        node: elt,
        isActiveAllModules,
        createNodeActions,
      }))
    }
  </Tree.TreeNode>
);

export default renderResourceNode;
