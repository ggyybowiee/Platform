import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Checkbox } from 'antd';
import Login from 'components/Login';
import UserLayout from '../../layouts/UserLayout';
import config from '../../config';
import styles from './index.less';

const { Tab, UserName, Password, Submit } = Login;
// TODO: 完善login状态，如登录中、服务器提示错误
@connect(({ login = {}, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {

  state = {
    autoLogin: false,
    visible: true,
    replacement: null,
    message: '',
    isCapSLock: false,
  }

  componentWillMount() {
    window.platform.event.subscribe('noToken', (component) => {
      this.setState({
        visible: false,
        replacement: component,
      });
    });
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });

    this.props.dispatch({
      type: 'auth/rememberUserToken',
      payload: e.target.checked,
    });
  }

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'auth/login',
        payload: values,
      }).then((response) => {
        this.setState({
          message: _.get(response, 'message'),
        });
      });
    }
  };

  renderMessage = content => {
    if (!content || this.props.submitting) {
      return null;
    }

    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  // detectCapsLock = event => {
  //   const keyCode = event.keyCode || event.which;
  //   const isShift = event.shiftKey || (keyCode === 16) || false;
  //   let isCapSLock = false;

  //   if (
  //     ((keyCode >= 65 && keyCode <= 90) && !isShift) ||
  //     ((keyCode >= 97 && keyCode <= 122) && isShift)
  //   ) {
  //     isCapSLock = true;
  //   }

  //   this.setState({
  //     isCapSLock
  //   })
  // }

  render() {
    const { login, submitting } = this.props;
    const { autoLogin, visible, replacement, message, isCapSLock } = this.state;

    /**
     *  处理部分应用不需要登录或非密码登录的情况，比如小白板使用mac地址获取token，此时不需要登录界面
     *  在其应用内部自行处理登录操作，通常此页面不会显示，除非网络状况差或服务器停止运行时，此界面才会出现。
     * */
    if (!visible) {
      return replacement();
    }

    return (
      <UserLayout title="登录" {...this.props}>
        <div className={styles.main}>
          <Login defaultActiveKey="account" onSubmit={this.handleSubmit}>
            <Tab key="account" tab="账户密码登录">
              {this.renderMessage(message)}
              <UserName name="username" placeholder={config.get('userNamePlaceholder')} />
              <Password name="password" placeholder={config.get('passwordPlaceholder')} onKeyPress={this.detectCapsLock}/>
              {/* {isCapSLock && <div className={styles.capsLockText}>大写锁定键被按下，请注意大小写</div>} */}
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                自动登录
              </Checkbox>
            </div>
            <Submit loading={submitting}>登录</Submit>
          </Login>
        </div>
      </UserLayout>
    );
  }
}
