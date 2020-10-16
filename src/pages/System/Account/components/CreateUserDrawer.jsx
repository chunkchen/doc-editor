import React, { Component } from 'react';
import { Button, Drawer, Form, Input, message, Select } from 'antd';
import CacheService from '../../../../cacheService';
import { AddUserApi } from '../../../../api/user';

const Option = Select.Option;

export default class CreateUserDrawer extends Component {
  static displayName = 'CreateUserDrawer';

  constructor(props) {
    super(props);
    this.state = {
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


  confirmCreateUser = async () => {
    await this.setState({
      btnLoading: true,
    });
    this.refs.createUserForm.validateFields().then((values) => {
      AddUserApi(values).then((res) => {
        if (res.msg === 'SUCCESS') {
          message.success(`创建用户${values.username}成功`);
          this.props.submitSuccess();
          this.setState({
            btnLoading: false,
          });
        }
      }).catch(() => {
        this.setState({
          btnLoading: false,
        });
      });
    });
  };

  render() {
    const { roleList, btnLoading } = this.state;
    return (
      <div>
        <Drawer
          title="创建新用户"
          width={500}
          maskClosable={false}
          destroyOnClose
          onClose={this.props.onClose}
          visible={this.props.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={(
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={this.props.onClose}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button onClick={this.confirmCreateUser} type="primary" loading={btnLoading}>
                确认创建
              </Button>
            </div>
          )}
        >
          <Form layout="vertical" ref="createUserForm">
            <Form.Item
              name="nickName"
              label="昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item label="角色" name="rolesId">
              <Select
                mode="multiple"
                showSearch
                placeholder="请选择角色"
              >
                {
                  roleList.map((role, index) => {
                    return (
                      <Option key={index} value={role.id}>{role.description}</Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="激活状态" name="activated">
              <Select
                showSearch
                placeholder="请选择激活状态"
              >
                <Option value>激活</Option>
                <Option value={false}>未激活</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ required: true, message: '请输入邮箱' }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="手机号"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }
}
