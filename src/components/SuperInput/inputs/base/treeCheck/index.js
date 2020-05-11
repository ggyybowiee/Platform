import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default class TreeCheck extends React.Component {

  handleCheck = (...args) => {
    if (this.props.onCheck) {
      this.props.onCheck(...args);
    }
    if (this.props.onChange) {
      this.props.onChange(...args);
    }
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  render() {
    const { treeData, value, onChange, ...otherProps } = this.props;
    return (
      <Tree checkedKeys={value} checkable {...otherProps} onCheck={this.handleCheck}>
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

TreeCheck.properties = {
};

TreeCheck.info = {
  name: '树型复选',
  category: '选择',
};

TreeCheck.structure = {
  type: 'array',
};
