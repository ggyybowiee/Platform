import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';

export default [{
  type: 'ward',
  format: (value, { Elt = 'span' } = {}) => {
    const ConnnctedElt = connect(state => ({
      wardName: _.get(state, ['wards', 'map', value, 'wardName']),
    }))(
      ({ wardName }) => <Elt>{wardName}</Elt>
    );

    return <ConnnctedElt />;
  },
  title: '病区列表',
  desc: '从病区接口获取对应名称，并以生成指定（默认span）react dom元素',
  config: [{
    field: 'wardCode',
    type: 'string',
    title: '病区编号',
    desc: '病区',
  }, {
    field: 'Elt',
    type: 'string/react',
    title: '元素类型',
    desc: '包裹值得元素类型， 字符串或react元素，默认span',
    default: 'span',
  }],
}];
