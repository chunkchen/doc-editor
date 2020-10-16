import React, { Component } from 'react';
import { Card, Divider, Table } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import SearchForm from './SearchForm';
import './style.less';
import { PageLoginLogApi } from '../../../api/opLog';

export default class AccountList extends Component {
  static displayName = 'AccountList';

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableLoading: false,
      tableData: [],
    };
  }

  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList = () => {
    const { keyword } = this.state;
    const params = {
      keyword,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    PageLoginLogApi(params).then((res) => {
      const { code, msg, data } = res;
      if (code === '200' && msg === 'SUCCESS' && data) {
        this.setState({
          tableData: data.records,
          total: data.total,
        });
      }
    });
  };

  goSearch = async (values) => {
    if (values) {
      await this.setState({
        keyword: values.keyword && values.keyword.trim(),
      });
      this.fetchUserList();
    }
  };

  render() {
    const { tableData, tableLoading, total } = this.state;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '登陆IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '登陆时间',
        dataIndex: 'loginTime',
        key: 'loginTime',
      },
      {
        title: '用户代理',
        dataIndex: 'userAgent',
        key: 'userAgent',
      },
    ];

    return (
      <PageHeaderWrapper className="user-list-home">
        <Card className="card-content">
          <SearchForm onSearch={this.goSearch} />
          <Divider />
          <Table loading={tableLoading} rowKey="id" columns={columns} dataSource={tableData} pagination={total} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
