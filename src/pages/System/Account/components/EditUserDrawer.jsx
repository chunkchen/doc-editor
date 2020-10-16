import React, { Component } from 'react';
import { Button, Drawer, Form, Input, message, Select } from 'antd';
import CacheService from '../../../../cacheService';
import { ModifyUserInfoApi } from '../../../../api/user';

const { Option } = Select;
export default class EditUserDrawer extends Component {
  static displayName = 'EditUserDrawer';

  constructor(props) {
    super(props);
    this.state = {
      roleList: [],
      btnLoading: false,
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
    this.refs.createUserForm.validateFields().then((value) => {
      const { userInfo } = this.props;
      value.userId = userInfo.userId;
      ModifyUserInfoApi(value).then((res) => {
        if (res.msg === 'SUCCESS') {
          message.success(`修改用户${value.username}成功`);
          this.setState({
            btnLoading: false,
          });
          this.props.submitSuccess();
        }
      });
    }).catch((error) => {
      console.error(error);
      this.setState({
        btnLoading: false,
      });
    });
  };

  render() {
    const { userInfo } = this.props;
    if (userInfo) {
      userInfo.rolesId = userInfo.roles.map(s => s.id);
    }
    const { roleList, btnLoading } = this.state;
    return (
      <div>
        <Drawer
          title="编辑用户"
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
                确认修改
              </Button>
            </div>
          )}
        >
          <Form layout="vertical" initialValues={userInfo} ref="createUserForm">
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input disabled placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="nickName"
              label="昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
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
            <Form.Item
              name="newPassword"
              label="密码"
            >
              <Input.Password placeholder="请输入新密码(不修改则不填)" />
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
            <Form.Item label="激活状态" name="activated">
              <Select
                showSearch
                placeholder="请选择激活状态"
              >
                <Option value>激活</Option>
                <Option value={false}>未激活</Option>
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }
}
