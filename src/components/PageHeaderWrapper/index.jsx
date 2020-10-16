import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import './style.less';
import { siteConfig } from '../../siteConfig';

import { getBreadNamesByPathname } from '../../util/sys';

export default class PageHeaderWrapper extends Component {
  static displayName = 'PageHeaderWrapper';

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { title, content, extraContent, footer, children, className } = this.props;
    const urlHash = window.location.hash;
    const index = urlHash.indexOf('?');
    const pathname = urlHash.substr(1, index === -1 ? urlHash.length - 1 : index - 1);
    const breadNames = getBreadNamesByPathname(pathname);
    let docTitle;
    if (breadNames.length === 2) {
      docTitle = `${breadNames[0]}-${breadNames[1]}`;
    }
    if (breadNames.length === 1) {
      docTitle = breadNames[0];
    }
    return (
      <DocumentTitle title={`${docTitle}-${siteConfig.siteName}`}>
        <div className={className ? `${className} page-header-wrapper` : 'page-header-wrapper'}>
          <div className="page-header">
            <Breadcrumb>
              <Breadcrumb.Item key={0}>
                <Link to="/">
                  首页
                </Link>
              </Breadcrumb.Item>
              {
                breadNames.map((item, i) => {
                  return (
                    <Breadcrumb.Item key={i + 1}>
                      {item}
                    </Breadcrumb.Item>
                  );
                })
              }
            </Breadcrumb>
            <div className="page-header-heading">
              <span className="page-header-heading-title">
                {title || docTitle}
              </span>
              {
                extraContent && (
                  <div className="page-header-heading-extra">
                    {extraContent}
                  </div>
                )
              }
            </div>
            {
              content && (
                <div className="page-header-content">
                  {content}
                </div>
              )
            }
            {
              footer && (
                <div className="page-header-footer">
                  {footer}
                </div>
              )
            }
          </div>

          <div className="page-content"
            style={{
              margin: '24px 24px',
              minHeight: 280,
              flex: 'auto',
            }}
          >
            {children}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
