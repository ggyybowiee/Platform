import React from 'react';
import _ from 'lodash';
import { Form, Button } from 'antd';
import SuperInput, { defaultValidateMessages } from '../SuperInput';
import styles from './index.less';

const { Item: FormItem } = Form;

const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create({ validateMessages: defaultValidateMessages })
export default class SimpleForm extends React.Component {
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { form: { validateFields } } = this.props;
    if (!this.props.onSubmit) {
      return;
    }
    validateFields((errors, values) => {
      if (!_.isEmpty(errors)) {
        return;
      }
      this.props.onSubmit(values);
    });
  }

  render() {
    const {
      fields,
      values = {},
      form: { getFieldProps, getFieldsError, isFieldsTouched },
      formItemLayout = defaultFormItemLayout,
      onCancel,
    } = this.props;

    const errors = getFieldsError();
    const isValid = _.isEmpty(errors) || _.every(errors, _.isEmpty);
    const isDirty = isFieldsTouched();

    return (
      <Form onSubmit={this.handleSubmit}>
        {
          _.map(fields, field => (
            <FormItem label={field.label} {...formItemLayout}>
              <SuperInput {...getFieldProps(field.field, { initialValue: _.defaultTo(values[field.field], field.initialValue), rules: field.rules })} {...field} />
            </FormItem>
          ))
        }
        <div className={styles.footer}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" disabled={!isValid || !isDirty}>保存</Button>
        </div>
      </Form>
    );
  }
}
