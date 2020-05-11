import Design from './Design';
import Render from './Render';

export default {
  showName: '纵向表格',
  Design, Render,
  initDetail: (elements) => {
    return new Promise((resolve, reject) => {
      resolve({
        rows: _.map(elements, 'id'),
        columns: [{
          title: '属性',
          dataIndex: 'field.label',
          key: 'field.label',
        }, {
          title: '值',
          dataIndex: 'input',
          key: 'input',
          isRenderElement: true,
        }],
      });
    });
  }
};
