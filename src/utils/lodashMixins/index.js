import _ from 'lodash';
import mapValuesByKeyMap from './mapValuesByKeyMap';
import mapArrayValuesByKeyMap from './mapArrayValuesByKeyMap';
import unshift from './unshift';
import forEachTreeNodes from './forEachTreeNodes';
import mapTreeNodes from './mapTreeNodes';
import filterTreeNodes from './filterTreeNodes';
import toTree from './toTree';

_.mixin({
  mapValuesByKeyMap,
  mapArrayValuesByKeyMap,
  unshift,
  forEachTreeNodes,
  mapTreeNodes,
  filterTreeNodes,
  toTree,
});
