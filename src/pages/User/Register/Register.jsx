import React, { Component } from 'react';
import { Button, Cascader, Col, Form, Input, Row, Select } from 'antd';
import DocumentTitle from 'react-document-title';
import './style.scss';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../../siteConfig';

const { Option } = Select;

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default class Register extends Component {
  static displayName = 'Register';

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.history.push('/user/register-result');
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const prefixSelector = (
      <Select style={{ width: 70 }} defaultValue="86">
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    return (
      <DocumentTitle title={`用户注册-${siteConfig.siteName}`}>
        <div className="register-home">
          <div className="register-top">
            <span className="title">{siteConfig.siteName}</span>
            <p className="desc">注册</p>
          </div>
          <Form onFinished={this.handleSubmit} className="register-form">
            <Form.Item rule={[
              {
                type: 'email',
                message: '邮箱格式不正确!',
              },
              {
                required: true,
                message: '请输入邮箱地址!',
              },
            ]}
            >
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
            <Form.Item rule={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}>
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item hasFeedback
              rule={[
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item hasFeedback
              rule={[
                {
                  required: true,
                  message: '请确认您的面!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ]}
            >
              <Input.Password onBlur={this.handleConfirmBlur} placeholder="确认密码" />
            </Form.Item>
            <Form.Item initialValue={['zhejiang', 'hangzhou', 'xihu']}
              rule={[
                { type: 'array', required: true, message: '请选择你的经常居所!' },
              ]}
            >
              <Cascader options={residences} />
            </Form.Item>
            <Form.Item rule={[{ required: true, message: '请输入手机号!' }]}>
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item rule={[{ required: true, message: '请输入验证吗!' }]}>
              <Row gutter={8}>
                <Col span={12}>
                  <Input placeholder="请输入验证吗" />
                </Col>
                <Col span={12}>
                  <Button>获取验证吗</Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <div className="button-op">
                <Button type="primary" htmlType="submit" style={{ width: '50%' }}>
                  注册
                </Button>
                <Link to="/user/login">使用已有账户登录</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </DocumentTitle>
    );
  }
}
