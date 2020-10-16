import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle="抱歉，服务器出错了。"
    extra={(
      <Link to="/">
        <Button type="primary">
          返回首页
        </Button>
      </Link>
    )}
  />
);
