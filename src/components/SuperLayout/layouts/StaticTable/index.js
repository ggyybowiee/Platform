import Design from './Design';
import Render from './Render';

export default {
  showName: '静态表格',
  Design, Render,
  initDetail: (elements) => {
    return new Promise((resolve, reject) => {
      const columns = [{
        title: '属性1',
        dataIndex: 'field1',
        key: 'field1',
      }, {
        title: '属性2',
        dataIndex: 'field2',
        key: 'field2',
      }];
      resolve({
        rows: _.chain(elements)
          .map('id')
          .chunk(columns.length)
          .map(rowElts => _.mapKeys(rowElts, (elt, index) => columns[index].dataIndex))
          .value(),
        columns,
      });
    });
  }
};
