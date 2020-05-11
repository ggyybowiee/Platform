import _ from 'lodash';

export default function mapTreeNodes(nodes, func, options, parentNode) {
  const {
    childrenField = 'children',
  } = options || {};

  return _.map(nodes, (node, key) => (
    func({
      ...node,
      [childrenField]: node[childrenField]
        ? mapTreeNodes(node[childrenField], func, options, node)
        : null
    }, key, parentNode)
  ));
};
