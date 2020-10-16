import React, { Component } from 'react';
import { Button, Form, Input, Select } from 'antd';

import CacheService from '../../../cacheService';

const { Option } = Select;

export default class SearchForm extends Component {
  static displayName = 'SearchForm';

  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        keyword: undefined,
        roleId: undefined,
      },
      roleList: [],
    };
  }

  componentDidMount() {
    this.getSysRoleList();
  }

  getSysRoleList = async () => {
    const roleList = await CacheService.getSysRoleListCache();
    this.setState({
      roleList,
    });
  };

  render() {
    const handleFormReset = () => {
      this.refs.searchForm.resetFields();
      this.props.onSearch(this.state.formValues);
    };
    const onFinish = (values) => {
      this.props.onSearch(values);
    };
    const { roleList } = this.state;
    return (
      <div className="search-form">
        <Form
          layout="inline"
          ref="searchForm"
          initialValues={{ roleId: '' }}
          onFinish={onFinish}
        >
          <Form.Item label="用户名/昵称" name="keyword">
            <Input placeholder="请输入用户名或昵称" />
          </Form.Item>
          <Form.Item label="角色" name="roleId">
            <Select
              showSearch
              style={{ width: 180 }}
              placeholder="请选择角色"
            >
              <Option value="">全部</Option>
              {
                roleList.map((role, index) => {
                  return (
                    <Option key={index} value={role.id}>{role.description}</Option>
                  );
                })
              }
            </Select>
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
