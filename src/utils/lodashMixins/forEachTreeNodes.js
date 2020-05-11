import _ from 'lodash';

export default function forEachTreeNodes(nodes, func, options, parentNode) {
  const {
    childrenField = 'children',
  } = options || {};
  _.forEach(nodes, (node, key) => {
    func(node, key, parentNode);
    if (node[childrenField]) {
      forEachTreeNodes(node[childrenField], func, options, node);
    }
  });
};
