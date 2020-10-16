import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import MainRouter from './MainRouter';
import { siteConfig } from '../../siteConfig';

import './index.scss';

import Index from '../../components/GlobalHeader';
import sideMenuConfig from '../../menuConfig';
import { checkHaveAuthByRequireRoles } from '../../util/auth';

import { setFold, setUnFold } from '../../reducers/actionTypes';

import store from '../../reducers/store';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class BasicLayout extends Component {
  static displayName = 'BasicLayout';

  constructor(props) {
    super(props);
    const { pathname } = this.props.location;
    const firstPath = [pathname.substr(0, pathname.lastIndexOf('/'))];
    this.state = {
      collapsed: sessionStorage.getItem('collapsed') === 'true' || false,
      defaultOpenKey: firstPath,
      defaultActive: pathname,
    };
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
    sessionStorage.setItem('collapsed', !collapsed);
    // 状态更新
    if (collapsed) {
      store.dispatch(setUnFold());
    } else {
      store.dispatch(setFold());
    }
  };

  handleClick = (e) => {
    const { pathname } = this.props.location;
    if (pathname !== e.key) {
      this.props.history.push(e.key);
    }
  };

  render() {
    const { defaultActive, defaultOpenKey, collapsed } = this.state;
    return (
      <Layout className="basic-layout">
        <Sider width={260}
          breakpoint="lg"
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="menu-sider"
          style={{
            height: '100vh',
          }}
        >
          <div className={collapsed ? 'just-icon' : 'left-logo'}>
            {
              collapsed ? (<span>LOGO</span>) : (<span>{siteConfig.siteName}</span>)
            }
          </div>
          <Menu theme="dark"
            mode="inline"
            defaultOpenKeys={defaultOpenKey}
            defaultSelectedKeys={[defaultActive]}
            onClick={this.handleClick}
          >
            {
              sideMenuConfig.map((item) => {
                if (item.roles && item.roles.length > 0 && !checkHaveAuthByRequireRoles(item.roles)) {
                  return null;
                }
                if (item.children && item.children.length > 0) {
                  return (
                    <SubMenu
                      key={item.path}
                      title={(
                        <div>
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                      )}
                    >
                      {
                        item.children.map((childItem) => {
                          if (childItem.roles && childItem.roles.length > 0 && !checkHaveAuthByRequireRoles(childItem.roles)) {
                            return null;
                          }
                          return (
                            <Menu.Item key={item.path === '/' ? childItem.path : item.path + childItem.path}>
                              {childItem.icon}
                              <span>{childItem.name}</span>
                            </Menu.Item>
                          );
                        })
                      }
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item key={item.path}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </Sider>
        <Layout
          style={{
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Header style={{ background: '#fff', padding: 0 }} className="global-header">
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            <Index />
          </Header>
          <Content className="global-content">
            <MainRouter />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
