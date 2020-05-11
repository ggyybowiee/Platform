import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { getApi } from 'utils/request';
import dataTransform from 'services/dataTransform';
import SuperInput from '../../../SuperInput';

const AJAX_CACHE_MAP = {};
const AJAX_CACHE_KEEP_TIME = 60000;

function mapValuesByObject(target, mapObject) {
  return _.mapValues(mapObject, v => target[v]);
}

class ConnectInput extends React.Component {
  state = {}

  componentDidMount() {
    this.ajax();
  }

  componentWillUpdate(prevProps) {
    if (!_.isEqual(prevProps.ajaxProps, this.props.ajaxProps)) {
      this.ajax(prevProps);
    }
  }

  setAjaxState(propKey, value) {
    const { initFirstFinish } = this.props;
    this.setState({
      [propKey]: value,
    });
    if (initFirstFinish) {
      // 当类似tableLayout同步url参数时，立即onChange进行设置值，会早于桐木Url同步，导致被覆盖，故而添加下一轮执行周期设置值。
      setTimeout(() => {
        this.props.onChange(_.get(this.state, initFirstFinish));
      }, 0);
    }
  }

  ajax(props) {
    const { ajaxProps } = props || this.props;

    _.forEach(ajaxProps, ({ url, dataTransforms }, propKey) => {
      if (AJAX_CACHE_MAP[url]) {
        if (AJAX_CACHE_MAP[url].then) {
          AJAX_CACHE_MAP[url].then(data => {
            this.setAjaxState(propKey, dataTransform(dataTransforms)(data));
          });
        } else {
          this.setAjaxState(propKey, dataTransform(dataTransforms)(AJAX_CACHE_MAP[url]));
        }
        return;
      }

      let resolveAjax;
      AJAX_CACHE_MAP[url] = new Promise(resolve => {
        resolveAjax = resolve;
      });
      getApi(url)
        .then(resp => {
          AJAX_CACHE_MAP[url] = resp;
          const data = dataTransform(dataTransforms)(resp);
          resolveAjax(data);
          this.setAjaxState(propKey, data);
          setTimeout(() => {
            delete AJAX_CACHE_MAP[url];
          }, AJAX_CACHE_KEEP_TIME);
        });
    })
  }

  render() {
    const {
      type,
      compType,
      ...inputProps
    } = this.props;
    const Comp = compType ? SuperInput.CompMap[compType] : SuperInput.DefaultComp;

    return (
      <Comp {...inputProps} {...this.state} />
    );
  }
}

ConnectInput.properties = {
  ajaxProps: {
    showName: 'Ajax属性',
    properties: {
      options: {
        showName: 'ajax参数',
        properties: {
          url: {
            showName: 'Url',
            type: 'string',
          },
          dataTransforms: {
            showName: '数据转化',
            type: 'optionArray',
            fields: [{
              field: 'type',
              enumType: 'select',
              showName: '转化方式',
              type: 'enum',
              options: [{
                label: 'unshift',
                value: 'unshift',
              }, {
                label: 'mapArrayValuesByKeyMap',
                value: 'mapArrayValuesByKeyMap',
              }],
            }, {
              field: 'args',
              showName: '参数设置',
              type: 'optionArray',
            }],
          },
        },
      },
    },
  },

  style: {
    showName: '样式',
    type: 'json',
  },
};

ConnectInput.info = {
  name: 'Ajax：连接store',
  category: '特殊',
};

ConnectInput.validatorRules = [{
  type: 'any',
}];

ConnectInput.structure = {
  type: 'any',
};

export default ConnectInput;
