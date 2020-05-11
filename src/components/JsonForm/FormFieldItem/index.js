import React from 'react';
import { Form, Popover, Icon } from 'antd';

const FormFieldItem = ({ field, defalutValues, ContentComp, contentProps, form, formItemLayout }) => {
  const label = field.tooltip ? (
    <span>
      {field.label}
      {
        tooltip && (
          <Popover content={tooltip}>
            <Icon className={styles.tooltip} type="question-circle-o" />
          </Popover>
        )
      }
    </span>
  ) : field.label;

  return (
    <Form.Item {...formItemLayout} label={label}>
      <ContentComp
        {...contentProps}
        {...form.getFieldProps(field.name, {
          ...field,
          initialValue: _.isNil(_.get(defalutValues, field.name))
            ? field.initialValue
            : _.get(defalutValues, field.name)
        })}
        form={form}
      />
    </Form.Item>
  );
};

FormFieldItem.getProperties = () => [
  {
    field: {
      name: 'label',
      label: '标签',
      rules: [{
        required: true,
        message: '必填项',
      }],
    },
    input: {
      type: 'string',
    },
  },
  {
    field: {
      name: 'name',
      label: '字段名',
      rules: [{
        required: true,
        message: '必填项',
      }],
    },
    input: {
      showName: '字段名',
    },
  },
  {
    field: {
      name: 'tooltip',
      label: '标签提示',
    },
    input: {
      type: 'textArea',
    },
  },
];

export default FormFieldItem;
