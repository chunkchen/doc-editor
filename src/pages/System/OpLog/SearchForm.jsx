import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';

export default class SearchForm extends Component {
  static displayName = 'SearchForm';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const handleFormReset = () => {
      this.refs.searchForm.resetFields();
      this.props.onSearch({});
    };
    const onFinish = (values) => {
      this.props.onSearch(values);
    };
    return (
      <div className="search-form">
        <Form layout="inline"
          ref="searchForm"
          onFinish={onFinish}
        >
          <Form.Item label="用户名/登陆IP" name="keyword">
            <Input placeholder="请输入用户名或登陆IP" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            onClick={handleFormReset}
          >
            重置
          </Button>
        </Form>
      </div>
    );
  }
}
