import Design from './Design';
import Render from './Render';

export default {
  showName: '横向表格',
  Design, Render,
  initDetail: (elements) => {
    return new Promise((resolve, reject) => {
      const columns = _.map(elements, elt => ({
        title: '属性1',
        dataIndex: elt.id,
        dataKey: elt.id,
      }));
      resolve({
        columns,
      });
    });
  },
};
