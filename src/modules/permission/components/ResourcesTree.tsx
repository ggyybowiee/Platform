import { Resource, Module } from '../classes/Resource.interface';
import { getResourceTypeName } from '../utils';

const {
  vendor: {
    react: React,
    antd: { Tree },
    lodash,
  },
} = window.platform;

const _ = lodash;

export default class ResourceTree extends React.Component {

  renderTreeNode = (node) => {
    const { renderTitle } = this.props;
    const title = `${node.name} (${getResourceTypeName((node as Resource).type)})`;
    return (
      <Tree.TreeNode title={renderTitle ? renderTitle(title, node) : title}>
        {node.children}
      </Tree.TreeNode>
    )
  }

  render() {
    const { modules }: { modules: Module[] } = this.props;

    return (
      <Tree
        showIcon
        showLine
      >
        {
          _.mapTreeNodes(modules, this.renderTreeNode)
        }
      </Tree>
    );
  }
}
