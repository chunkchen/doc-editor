import React, { Component } from 'react';
import { Button, Card, Divider, Table, Tag } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import SearchForm from './SearchForm';
import './style.less';
import CreateUserDrawer from './components/CreateUserDrawer';
import EditUserDrawer from './components/EditUserDrawer';
import { PageListUserApi } from '../../../api/user';
import CacheService from '../../../cacheService';

export default class AccountList extends Component {
  static displayName = 'AccountList';

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableLoading: false,
      // 用户数据列表
      userList: [],
      // 当前操作的用户基本信息
      userInfo: undefined,
      // 创建用户弹窗
      createUserDrawerVisible: false,
      // 编辑用户弹窗
      editUserDrawerVisible: false,
    };
  }

  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList = () => {
    const { roleId, keyword } = this.state;
    const params = {
      keyword,
      roleId,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    PageListUserApi(params).then((res) => {
      const { code, msg, data } = res;
      if (code === '200' && msg === 'SUCCESS' && data) {
        this.setState({
          userList: data.records,
          total: data.total,
        });
      }
    });
  };

  /**
   * 创建新用户 drawer
   */
  openCreateUserDrawer = (e) => {
    e.preventDefault();
    this.setState({
      createUserDrawerVisible: true,
    });
  };

  closeCreateUserDrawer = () => {
    this.setState({
      createUserDrawerVisible: false,
    });
  };

  openEditUserDrawer = (record, e) => {
    e.preventDefault();
    this.setState({
      editUserDrawerVisible: true,
      userInfo: record,
    });
  };

  closeEditUserDrawer = () => {
    this.setState({
      editUserDrawerVisible: false,
    });
  };

  goSearch = async (values) => {
    if (values) {
      await this.setState({
        roleId: values.roleId,
        keyword: values.keyword && values.keyword.trim(),
      });
      this.fetchUserList();
    }
  };

  // 创建用户成功回调
  createUserSuccess = () => {
    this.fetchUserList();
    this.closeCreateUserDrawer();
    // 重置用户列表缓存
    CacheService.resetUserListCache();
  };

  // 编辑用户成功回调
  editUserSuccess = () => {
    this.fetchUserList();
    this.closeEditUserDrawer();
  };

  paginationChange = async (current) => {
    await this.setState({
      pageNum: current,
    });
    this.fetchUserList();
  };

  render() {
    const { userList, tableLoading, total, createUserDrawerVisible, editUserDrawerVisible, userInfo } = this.state;
    const extraContent = (
      <Button type="primary" onClick={e => this.openCreateUserDrawer(e)}>创建新用户</Button>
    );

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        render: text => (
          <span>{text.map(s => s.description).join(',')}</span>
        ),
      },
      {
        title: '激活状态',
        key: 'activated',
        dataIndex: 'activated',
        render: value => (
          <span>{value ? <Tag color="success">已激活</Tag> : <Tag color="default">未激活</Tag>}</span>
        ),
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: (text, record) => (
          <span className="btn" onClick={e => this.openEditUserDrawer(record, e)}>编辑</span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper className="user-list-home" extraContent={extraContent}>
        <Card className="card-content">
          <SearchForm onSearch={this.goSearch} />
          <Divider />
          <Table
            loading={tableLoading}
            rowKey="userId"
            columns={columns}
            dataSource={userList}
            pagination={{ total, current: this.state.pageNum, onChange: this.paginationChange }}
          />
          <CreateUserDrawer onClose={this.closeCreateUserDrawer}
            visible={createUserDrawerVisible}
            submitSuccess={this.createUserSuccess}
          />
          <EditUserDrawer userInfo={userInfo}
            onClose={this.closeEditUserDrawer}
            visible={editUserDrawerVisible}
            submitSuccess={this.editUserSuccess}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
