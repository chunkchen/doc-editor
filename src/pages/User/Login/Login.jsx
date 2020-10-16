import React, { Component } from 'react';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import './style.scss';
import DocumentTitle from 'react-document-title';
import { LoginApi } from '../../../api/user';
import { checkUserHaveLogin, removeAll, setRoles, setToken, setUserInfo } from '../../../util/auth';
import { siteConfig } from "../../../siteConfig";

const layout = {
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
export default class Login extends Component {
  static displayName = 'Login';

  constructor(props) {
    super(props);
    this.state = {
      loginBtnLoading: false,
    };
  }

  componentDidMount() {
    if (checkUserHaveLogin()) {
      message.success('自动登陆成功');
      this.props.history.push('/');
    }
  }

  handleSubmit = async (values) => {
    await this.setState({
      loginBtnLoading: true,
    });
    await LoginApi(values).then((res) => {
      const { code, data } = res;
      if (code === '200') {
        removeAll();
        const expires = data.expires;
        setUserInfo(JSON.stringify(data.userInfo), expires);
        setToken(data.token, expires);
        setRoles(data.roles, expires);
        message.success('登陆成功');
        this.props.history.push('/');
      }
    }).catch(() => {
      this.setState({
        loginBtnLoading: false,
      });
    });
  };

  render() {
    const onFinish = (values) => {
      this.handleSubmit(values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const { loginBtnLoading } = this.state;
    return (
      <DocumentTitle title={`用户登陆-${siteConfig.siteName}`}>
        <div className="login-home">

          <div className="wrapper">
            <div className="login-form">
              <div className="login-logo">{siteConfig.siteName}</div>
              <Divider />
              <Form
                {...layout}
                name="basic"
                initialValues={{ rememberMe: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder="用户名" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="密码" />
                </Form.Item>

                <div style={{ display: 'flex' }}>
                  <Form.Item {...tailLayout} name="rememberMe" valuePropName="checked">
                    <Checkbox>7天内自动登录</Checkbox>
                  </Form.Item>
                  <Button type="link">忘记登录密码？</Button>
                </div>

                <Form.Item {...tailLayout}>
                  <Button shape="round"
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    loading={loginBtnLoading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
