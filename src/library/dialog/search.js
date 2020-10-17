import React from 'react';
import { Button, Input, Tabs } from 'antd';
import 'antd/lib/tabs/style';
import 'antd/lib/input/style';
import 'antd/lib/button/style';
import Engine from '../editor/engine';

const { TabPane } = Tabs;

/**
 * @fileOverview 搜索会话框
 */

class DialogSearch extends React.Component {
  state = {
    searchValue: null,
    replacement: '',
  }

  componentWillUnmount() {
    const { engine } = this.props;
    const { search } = engine;
    search.clear();
    search.off('after:select', this.onAfterSelect);
    engine.off('change', this.onDocChange);
  }

  componentDidMount() {
    const { engine } = this.props;
    const { search } = engine;
    const input = this.inputRef.input;

    const onAfterSelect = () => {
      this.setState({
        engine,
      });
    };

    const onDocChange = () => {
      if (!engine.command.queryState('search')) {
        return;
      }
      engine.search.reFind();
    };

    this.onAfterSelect = onAfterSelect;
    this.onDocChange = onDocChange;
    search.on('after:select', onAfterSelect);
    input.focus(); // 初始化自动聚焦查找框
    // 编辑时候更新搜索结果
    engine.on('change', onDocChange);
  }

  render() {
    const { engine, onClose } = this.props;
    const search = engine.search;
    const locale = engine.locale.search;
    const { searchValue, replacement } = this.state;
    const count = search.count();
    const searchInput = (
      <p style={{ marginBottom: '12px' }}>
        <Input
          accessbilityid="search-input"
          placeholder={locale.pleaseEnter}
          onKeyDown={(e) => {
            if (Engine.isHotkey('enter', e)) {
              search.next();
            }
          }}
          onChange={(e) => {
            const ranges = search.find(e.target.value);
            search.select(ranges[0]);
            this.setState({
              searchValue: e.target.value,
            });
            search.scrollIntoView();
          }}
          ref={element => this.inputRef = element}
          value={searchValue}
          suffix={count === 0 ? <span className="count">0</span> : <span className="count">{count[0] / count[1]}</span>}
        />
      </p>
    );
    const replacementInput = (
      <p style={{ marginBottom: '16px' }}>
        <Input
          accessbilityid="replace-input"
          placeholder={locale.pleaseEnter}
          onChange={(e) => {
            this.setState({
              replacement: e.target.value,
            });
          }}
        />
      </p>
    );
    const next = (
      <Button onClick={() => {
        search.next();
      }}
        disabled={!!(count === 0 || count[0] === count[1])}
      >
        {locale.next}
      </Button>
    );
    const prev = (
      <Button onClick={() => {
        search.prev();
      }}
        disabled={!!(count === 0 || count[0] === count[1])}
      >
        {locale.previous}
      </Button>
    );
    return (
      <Tabs
        defaultActiveKey="search"
        animated={false}
        className="lake-search"
        style={{ padding: '0 2px' }}
        tabBarExtraContent={(
          <span className="lake-icon lake-icon-close"
            accessbilityid="searchreplace-close-button"
            onClick={() => onClose()}
          />
)}
      >
        <TabPane
          tab={locale.search}
          key="search"
        >
          {searchInput}
          <p style={{ textAlign: 'right' }}>
            {prev}
            {next}
          </p>
        </TabPane>
        <TabPane
          tab={locale.replace}
          key="replace"
        >

          <p style={{ textAlign: 'right' }}>{locale.search}</p>
          {searchInput}
          <p>{locale.replaceTo}</p>
          {replacementInput}
          <p style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                search.replaceAll(replacement);
                search.scrollIntoView();
              }}
              style={{ marginLeft: '0px' }}
              disabled={count === 0}
            >
              {locale.replaceAll}
            </Button>
            <Button
              onClick={() => {
                search.replace(replacement);
                search.scrollIntoView();
              }}
              disabled={count === 0}
            >
              {locale.replace}
            </Button>
            {prev}
            {next}
          </p>
        </TabPane>
      </Tabs>
    );
  }
}

export default DialogSearch;
