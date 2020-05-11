import _ from 'lodash';

export default {
  phase: 'display',
  filter: ({ list, filterField, filterValue, config: { searchFeilds, matchType, isIgnoreCase = false } }) => {
    if (!filterValue) {
      return list;
    }

    return _.filter(list, item => {
      return _.some(item, (value = '', key) => {
        if (!_.includes(searchFeilds, key)) {
          return false;
        }
        const matchFunc = _.isFunction(matchType) ? matchType : _[matchType];
        if (isIgnoreCase && !_.isNil(value)) {
          return matchFunc(value.toLowerCase(), filterValue.toLowerCase());
        }
        return matchFunc(value, filterValue);
      });
    });
  },
};
