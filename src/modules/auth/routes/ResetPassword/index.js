import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Alert, Form, Input, Button } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { defaultValidateMessages } from 'components/SuperInput';
import styles from './index.less';

const { Item: FormItem } = Form;
const regSpace = /\s*/g;

@connect(({ login, loading, auth }) => ({
  login,
  userCode: _.get(auth, 'currentUser.userCode'),
  submitting: loading.effects['login/login'],
}))
@Form.create({ validateMessages: defaultValidateMessages })
export default class ResetPasswordPage extends Component {
  handleSubmit = evt => {
    evt.preventDefault();
    const { form: { validateFields } } = this.props;

    validateFields({force: true}, (error, values) => {
      
      if (!error) {
        this.props.dispatch({
          type: 'auth/resetPassword',
          payload: values,
        });
      }
    });
  };

  checkOldPassword = (rule, value = null, callback) => {
    const { dispatch, form, userCode } = this.props;

    if (value && regSpace.test(value)) {
      form.setFieldsValue({
        oldPassword: value.replace(regSpace, ''),
      });
    }

    if (form.getFieldValue('newPassword')) {
      form.validateFields(['newPassword'], { force: true });
    }

    dispatch({
      type: 'auth/getCurrentPassword',
      payload: {
        userCode: userCode,
        userPassword: value,
      },
    }).then((response) => {
      if (value && !response) {
        callback('密码错误!');
      } else {
        callback();
      }
    })
      .catch(() => {
        callback('网络错误！');
      });
  };

  validateRepeatPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && regSpace.test(value)) {
      form.setFieldsValue({
        confirmNewPassword: value.replace(regSpace, ''),
      });
    }
   
    if (form.getFieldValue('newPassword') && form.getFieldValue('newPassword') !== form.getFieldValue('confirmNewPassword')) {
      callback('两次密码输入不一致');
    }
    
    callback();
  };

  validatePassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && regSpace.test(value)) {
      form.setFieldsValue({
        newPassword: value.replace(regSpace, ''),
      });
    }
    console.log(form.getFieldValue('oldPassword'))

    if (form.getFieldValue('oldPassword') && form.getFieldValue('newPassword') === form.getFieldValue('oldPassword')) {
      callback('新密码不能与原密码一致，请重新设置');
    }

    if (form.getFieldValue('confirmNewPassword')) {
      form.validateFields(['confirmNewPassword'], { force: true });
    }

    callback();
  };

  render() {
    const { form: { getFieldProps, getFieldsError, validateFields } } = this.props;

    const hasError = _.some(getFieldsError(), _.identity);

    return (
      <PageHeaderLayout>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="请输入原密码">
            <Input
              type="password"
              autocomplete="off"
              {...getFieldProps('oldPassword', { 
                rules: [
                  { required: true, min: 3, max: 22 },
                  { validator: this.checkOldPassword}
                ] 
              })}
              onPaste={evt => evt.preventDefault()}
            />
          </FormItem>
          <FormItem label="请输入新密码">
            <Input
              type="password"
              autocomplete="off"
              {...getFieldProps('newPassword', {
                rules: [
                  { required: true, min: 3, max: 22 },
                  {
                    pattern: /^[\w\d\@\~\.\!\#\$\%\^\&\*\(\)\-\+\_\=]+$/,
                    message: '不能含有空格等特殊字符',
                  },
                  { validator: this.validatePassword },
                ],
              })}
              onPaste={evt => evt.preventDefault()}
            />
          </FormItem>
          <FormItem label="再次确认密码">
            <Input
              type="password"
              autocomplete="off"
              {...getFieldProps('confirmNewPassword', {
                rules: [
                  { required: true, min: 3, max: 22 },
                  {
                    pattern: /^[\w\d\@\~\.\!\#\$\%\^\&\*\(\)\-\+\_\=]+$/,
                    message: '不能含有空格等特殊字符',
                  },
                  { validator: this.validateRepeatPassword },
                ],
              })}
              onPaste={evt => evt.preventDefault()}
            />
          </FormItem>
          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              disabled={hasError}
              className={styles.submitBtn}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
