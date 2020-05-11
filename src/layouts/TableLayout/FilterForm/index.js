import React from 'react';
import _ from 'lodash';
import qs from 'qs';
import { Form, Button, Icon } from 'antd';
import JsonForm from 'components/JsonForm';
import Filters from '../Filters';
import styles from './index.less';

const { Item: FormItem } = Form;

export default class FilterForm extends React.Component {
  // componentDidMount() {
  //   this.props.onValuesInited && this.props.onValuesInited(
  //     this.props.form.getFieldsValue()
  //   );
  // }

  handleValuesChange = (props, changedValues, allValues) => {
    if (!this.props.onChange) {
      return;
    }

    this.props.onChange(allValues, changedValues, props);
  }

  handleFormInited = values => {
    if (!this.props.onValuesInited) {
      return;
    }
    this.props.onValuesInited(values);
  }

  render() {
    const { formConfig, values, extraData } = this.props;
    // const {
    //   formConfig,
    //   form: { getFieldDecorator, submitBtns },
    //   formItemLayout,
    //   list,
    //   extraData,
    //   ...props
    // } = this.props;

    // const queryParams = qs.parse(platform.app._history.location.search.substr(1));

    return (
      <JsonForm
        data={values}
        elements={_.map(formConfig.elements, item => ({ ...item, id: item.id || (item.field && item.field.name) || Symbol('id') }))}
        layout={{
          type: 'inline',
        }}
        formSetting={{
          isShowSubmit: false,
          isLabelInline: true,
        }}
        {...formConfig}
        onEveryValueChange={this.handleValuesChange}
        onInited={this.handleFormInited}
        extraData={extraData}
        onSubmit={this.props.onChange}
      />
    );

    // TODO: 重构下面部分的按钮到上面的JsonForm
    return (
      <Form onSubmit={this.handleSearch} layout="inline" {...props}>
        {
          _.map(formConfig, ({ field: { name, ...field } = {}, input, NotInputComp }) => NotInputComp ? (
            <NotInputComp list={list} extraData={extraData} />
          ) : (
            <FormItem label={field.label} {...(formItemLayout || {})} style={field.hide ? { display: 'none' } : {}}>
              {getFieldDecorator(name, { ...field, initialValue: queryParams[name] || field.initialValue })(<Filters {...input} />)}
            </FormItem>
          ))
        }
        {
          submitBtns ? (
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          ) : null
        }
      </Form>
    );
  }
}
