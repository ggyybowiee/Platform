import _ from 'lodash';

export default elements => {
  return {
    type: 'grid',
    detail: _.map(elements, elt => [elt.id]),
  };
}
