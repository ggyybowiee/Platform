import _ from 'lodash';
import moment from 'moment';

export default {
  phase: 'queryParams',
  filter: ({ params, filterValue, config: { startDateField = 'startDate', endDateField = 'endDate', format = 'YYYY-MM-DD HH:mm:ss' } }) => {
    let dateRangeArr = filterValue || [];
    if (typeof dateRangeArr === 'string') {
      dateRangeArr = _.chain(dateRangeArr)
        .split(',')
        .map(str => moment(str).format(format))
        .value();
    }
    return { ...(params || {}), [startDateField]: dateRangeArr[0], [endDateField]: dateRangeArr[1] };
  },
};
