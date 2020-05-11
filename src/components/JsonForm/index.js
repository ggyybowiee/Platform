import React from 'react';

import { Form, Row, Col, Button, Tooltip, Icon, Popover } from 'antd';
import _ from 'lodash';
import styles from './index.less';

import SuperInput from 'components/SuperInput';
import SuperLayout from 'components/SuperLayout';
import FormFieldItem from './FormFieldItem';
import createDefaultLayout from './createDefaultLayout';

const FormItem = Form.Item;

const DEFAULT_FORM_SETTING = {
  isShowLabel: true,
  isShowSubmit: true,
  isLabelInline: false,
};

class JsonForm extends React.Component {

  componentDidMount() {
    const { onInited } = this.props;
    if (!onInited) {
      return;
    }
    onInited(this.props.form.getFieldsValue());
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values, this.props.form);
      }
    });
  }

  renderItem = (itemProps) => {
    const { field: rawField, input, tooltip, CustomComp } = itemProps;
    if (CustomComp) {
      return <CustomComp {...itemProps} extraData={this.props.extraData} />;
    }

    const { data, form } = this.props;
    const formSetting = _.defaults({}, this.props.formSetting, DEFAULT_FORM_SETTING);
    const field = {
      ...rawField,
      // TODO: 提取规则编辑器及规则校验组件:
      rules: _.map(rawField.rules, (rule) => {
        if (rule.pattern) {
          return {
            ...rule,
            pattern: new RegExp(_.get(rule, 'pattern.pattern'), _.get(rule, 'pattern.flags')),
          };
        }

        return rule;
      }),
    };

    return (
      <FormFieldItem
        ContentComp={SuperInput}
        field={field}
        form={form}
        defalutValues={data}
        formItemLayout={formSetting.formItemLayout}
        contentProps={input}
      />
    );
  }

  render() {
    const {
      elements, layout,
      data, actions, submitText = '保存',
      loading, formProps, disabled,
      className,
    } = this.props;
    const { getFieldProps } = this.props.form;
    const formSetting = _.defaults({}, this.props.formSetting, DEFAULT_FORM_SETTING);

    const layoutElements = _.every(elements, elt => !_.isNil(elt.id)) ? elements : _.map(elements, elt => ({ ...elt, id: elt.id || (elt.field && elt.field.name) }));

    return (
      <Form {...formProps} onSubmit={this.handleSubmit} layout={formSetting.isLabelInline ? 'inline' : 'horizontal'} className={className}>
        <SuperLayout
          dataSource={data}
          elements={layoutElements}
          Element={this.renderItem}
          {...(layout || createDefaultLayout(elements))}
        />
        {
          formSetting.isShowSubmit
            ? (
            <Row gutter={16}>
              <Col {...(formSetting.formItemLayout && formSetting.formItemLayout.labelCol || {})} />
              <Col {...(formSetting.formItemLayout && formSetting.formItemLayout.wrapperCol || {})}>
                <div className={styles.actionsContainer}>
                  <Button type="primary" htmlType="submit" disabled={_.isFunction(disabled) ? disabled(this.props.form) : disabled} loading={loading}>{submitText}</Button>
                  {actions}
                </div>
              </Col>
            </Row>
            ) : null
        }
      </Form>
    );
  }
}

// TODO: submiting


// TODO: 处理校验相互依赖
class JsonFormWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.Form = Form.create({ onValuesChange: this.handleValuesChange })(JsonForm);
  }

  handleValuesChange = (props, changedValues, allValues) => {
    if (this.props.onEveryValueChange) {
      this.props.onEveryValueChange(props, changedValues, allValues);
    }
    // TODO: 处理表单内校验
    if (!this.props.onSubmit || !this.props.formSetting || !this.props.formSetting.isAutoSubmit) {
      return;
    }
    this.props.onSubmit(allValues);
  }

  render() {
    const { Form } = this;
    return (
      <Form {...this.props} />
    );
  }
}

JsonFormWrapper.info = {
  title: '超级表单',
  desc: '根据传入的数据结构渲染成表单',
};

JsonFormWrapper.properties = {
  elements: {
    showName: '元素数组',
    desc: '表单元素对象数组',
    type: 'array',
  },
  layoutType: {
    showName: '布局类型',
    desc: '布局类型',
    type: 'enum',
    options: [{
      label: '网格（grid）',
      value: 'grid',
    }, {
      label: '表格（table）',
      value: 'table',
    }],
  },
  layout: {
    showName: '布局数据',
    desc: '与“布局类型”对应，描述具体布局信息',
    type: 'any',
  },
  data: {
    showName: '初始化数据',
    desc: '初始化数据',
    type: 'object',
  },
}

JsonFormWrapper.FormFieldItem = FormFieldItem;

export default JsonFormWrapper;
