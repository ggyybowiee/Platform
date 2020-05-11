import React from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import JsonForm from 'components/JsonForm';

import styles from './index.less';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export default class PropertiesForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      properties: this.computeProperties(props.properties, props.defaultValues),
    };
  }

  computeProperties(properties, values) {
    return _.isFunction(properties) ? properties(values) : properties;
  }

  handleEveryValueChange = (props, changedValues, allValues) => {
    const { checkNeedUpdateProperties } = this.props;
    if (checkNeedUpdateProperties && checkNeedUpdateProperties(changedValues, allValues)) {
      this.setState({
        properties: this.computeProperties(this.props.properties, allValues),
      });
    }
  }

  render() {
    const { defaultValues, form, onSave, onCancel } = this.props;
    const { properties } = this.state;
    const formElements = _.map(properties, prop => ({ ...prop, id: prop.field.name }));

    return (
      <JsonForm
        elements={formElements}
        formSetting={{formItemLayout: FORM_ITEM_LAYOUT}}
        data={defaultValues}
        actions={(
          <Button onClick={onCancel}>取消</Button>
        )}
        className={styles.form}
        onSubmit={onSave}
        onEveryValueChange={this.handleEveryValueChange}
      />
    );
  }
}

// TODO: 原渲染函数，渲染内嵌属性，未重构部分
  // import SuperInput, { defaultValidateMessages } from 'components/SuperInput';
  // import { update, set, concat, filter, compose } from 'lodash/fp';
  // renderFormItem = (property, field, part) => {
  //   const { form: { getFieldProps } } = this.props;
  //   const { edittingElement } = this.state;
  //   const path = `${part}.${field}`;

  //   if (property.type) {
  //     return (
  //       <FormItem className={styles.formItem} label={property.showName} {...FORM_ITEM_LAYOUT} required={property.required}>
  //         <SuperInput
  //           {...getFieldProps(path, {
  //             initialValue: _.get(edittingElement, path),
  //             rules: property.rules,
  //           })}
  //           {...property}
  //           type={property.type}
  //         />
  //       </FormItem>
  //     )
  //   }

  //   return (
  //     <Card title={property.showName}>
  //     {this.renderLoopPropertis(getFieldProps)(property, path)}
  //     </Card>
  //   );
  // }

  // renderLoopPropertis = getFieldProps => (property, field) => {
  //   const { edittingElement } = this.state;

  //   if (property.properties) {
  //     return _.map(property.properties, (innerProp, innerField) => {
  //       if (innerProp.properties) {
  //         return this.renderLoopPropertis(getFieldProps)(innerProp, `${field}.${innerField}`);
  //       }

  //       return (
  //         <FormItem className={styles.formItem} label={innerProp.showName} {...FORM_ITEM_LAYOUT} required={innerProp.required}>
  //           <SuperInput
  //             {...getFieldProps(`${field}.${innerField}`, {
  //               initialValue: _.get(edittingElement, `${field}.${innerField}`),
  //               rules: innerProp.rules,
  //             })}
  //             {...innerProp}
  //             type={innerProp.type}
  //           />
  //         </FormItem>
  //       );
  //     });
  //   }
  // }
