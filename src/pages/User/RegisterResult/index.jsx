import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { siteConfig } from '../../../siteConfig';
import './style.scss';

const actions = (
  <div className="actions">
    <Button size="large" type="primary" style={{ marginRight: '8px' }}>
      检查邮箱
    </Button>
    <Link to="/">
      <Button size="large">
        返回首页
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => (
  <DocumentTitle title={`注册成功-${siteConfig.siteName}`}>
    <Result
      className="register-result"
      status="success"
      title={(
        <div className="title">
          <span>注册成功!</span>
        </div>
      )}
      subTitle="激活邮箱"
      extra={actions}
    />
  </DocumentTitle>
);

export default RegisterResult;
