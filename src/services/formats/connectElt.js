import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';

export default {
  type: 'connectElt',
  format: (value, { path, Elt = 'span' } = {}) => {
    const ConnnctedElt = connect(state => ({
      connctedValue: _.get(state, path.replace(/__value__/g, value)),
    }))(
      ({ connctedValue }) => <Elt>{connctedValue}</Elt>
    );

    return <ConnnctedElt />;
  },
  title: '字典元素',
  desc: '从字典表获取对应名称，并以生成指定（默认span）react dom元素',
  config: [{
    field: 'path',
    type: 'string',
    title: 'state路径',
    desc: 'state路径, 值用占位符 __value__ 替代',
  }, {
    field: 'Elt',
    type: 'string/react',
    title: '元素类型',
    desc: '包裹值得元素类型， 字符串或react元素，默认span',
    default: 'span',
  }],
};
