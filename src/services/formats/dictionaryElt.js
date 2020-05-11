import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';

export default {
  type: 'dictionaryElt',
  format: (value, { dicType, Elt = 'span' } = {}) => {
    const ConnnctedElt = connect(state => ({
      dicName: _.get(state, ['dictionary', 'meaningMap', dicType, value]),
    }))(
      ({ dicName }) => <Elt>{dicName}</Elt>
    );

    return <ConnnctedElt />;
  },
  title: '字典元素',
  desc: '从字典表获取对应名称，并以生成指定（默认span）react dom元素',
  config: [{
    field: 'dicType',
    type: 'string',
    title: '字典类型',
    desc: '字典类型',
  }, {
    field: 'Elt',
    type: 'string/react',
    title: '元素类型',
    desc: '包裹值得元素类型， 字符串或react元素，默认span',
    default: 'span',
  }],
};
