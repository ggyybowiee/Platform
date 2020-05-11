import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import qs from 'qs';
import SuperInput from 'components/SuperInput';
import styles from './index.less';

const context = require.context('./', true, /\.filter\.js$/);

const Filters = _.chain(context.keys())
  .mapKeys((path) => {
    return _.lowerFirst(path.match(/\.\/(\w+)\//)[1]);
  })
  .mapValues(key => context(key).default)
  .value();


// class Filter extends React.Component {
//   constructor(props) {
//     super(props);
//     console.log('props.type***', props.type);
//   }

//   render() {
//     const { props } = this;
//     return <SuperInput {...props} className={classnames(styles.input, props.className)} />;
//   }
// }
const Filter = (props) => {
  return <SuperInput {...props} className={classnames(styles.input, props.className)} />
};

Filter.filters = Filters;

function syncUrlParamsIfNeed(syncUrl, filterField, filterValue) {
  if (syncUrl) {
    const currentParams = qs.parse(platform.app._history.location.search.substr(1));
    if (!_.isUndefined(filterValue) && currentParams[filterField] !== filterValue) {
      platform.app._history.replace({
        pathname: platform.app._history.location.pathname,
        search: `?${qs.stringify({ ...currentParams, [filterField]: filterValue })}`,
      });
    }
  }
}

Filter.filter = (list, filters, filterValues) => {
  if (_.isEmpty(filters)) {
    return list;
  }

  return _.reduce(filters, (resultList, filterItem) => {
    if (!filterItem) {
      return resultList;
    }
    if (!Filter.filters[filterItem.type] || Filter.filters[filterItem.type].phase !== 'display') {
      return resultList;
    }
    const filterField = filterItem.key;
    const filterValue = filterValues[filterItem.key];
    syncUrlParamsIfNeed(filterItem.syncUrl, filterField, filterValue);
    return Filter.filters[filterItem.type].filter({
      list: resultList,
      filterField,
      filterValue,
      config: filterItem,
      filters,
      filterValues,
    });
  }, list);
}

Filter.queryParams = (filters, filterValues) => {
  if (_.isEmpty(filters)) {
    return {};
  }

  return _.reduce(filters, (resultParams, filterItem) => {
    if (!filterItem) {
      return resultParams;
    }
    if (!Filter.filters[filterItem.type] || Filter.filters[filterItem.type].phase !== 'queryParams') {
      return resultParams;
    }
    const filterField = filterItem.key;
    const filterValue = filterValues[filterItem.key];
    syncUrlParamsIfNeed(filterItem.syncUrl, filterField, filterValue);
    return Filter.filters[filterItem.type].filter({
      params: resultParams,
      filterField,
      filterValue,
      config: filterItem,
      filters,
      filterValues,
    });
  }, {});
}

export default Filter;
