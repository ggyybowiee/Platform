import React from 'react';
import { Tree } from 'antd';

export default ({ key, title, children }) => (
  <Tree.TreeNode title={title} key={key}>
    {children}
  </Tree.TreeNode>
);
