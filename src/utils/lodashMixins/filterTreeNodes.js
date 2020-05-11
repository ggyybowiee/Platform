import _ from 'lodash';

export default function filterTreeNodes(nodes, func, options, parentNode) {
  const {
    childrenField = 'children',
  } = options || {};
  return _.chain(nodes)
    .map((node, key) => {
      const newNode = { ...node };
      if (!func(node, key, parentNode)) {
        return undefined;
      }
      if (node[childrenField]) {
        newNode[childrenField] = filterTreeNodes(node[childrenField], func, options, parentNode);
      }
      return newNode;
    })
    .filter(_.negate(_.isUndefined))
    .value();
};
