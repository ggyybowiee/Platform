import _ from 'lodash';

export default (nodeList, { idField = 'code', parentField = 'parent', childrenField = 'children' } = {}) => {
  const resultNodeList = _.cloneDeep(nodeList);
  const nodesMap = _.mapKeys(resultNodeList, idField);
  _.forEach(resultNodeList, node => {
    const parentId = node[parentField];
    if (!parentId) {
      return;
    }

    if (!nodesMap[parentId][childrenField]) {
      nodesMap[parentId][childrenField] = [];
    }

    nodesMap[parentId][childrenField].push(node);
  });

  return resultNodeList;
}
