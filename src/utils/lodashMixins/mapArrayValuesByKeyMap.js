import _ from 'lodash';
import mapValuesByKeyMap from './mapValuesByKeyMap';

export default function mapArrayValuesByKeyMap(array, keyMap) {
  return _.map(array, item => mapValuesByKeyMap(item, keyMap));
};