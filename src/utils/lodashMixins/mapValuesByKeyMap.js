import _ from 'lodash';

export default function mapValuesByObject(target, mapObject) {
  return _.mapValues(mapObject, v => target[v]);
};