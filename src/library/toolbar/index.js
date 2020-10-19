import React from 'react';
import classnames from 'classnames';
import Engine from 'doc-engine/lib';
import toolbarConfig from '../config/toolbar';
import ToolbarPlugins from './toolbar-plugins';
import ToolbarGroup from './toolbar-group';
import { getHotkeyText } from '../utils/string';

class Toolbar extends React.Component {
  state = {
    pluginToolbar: [],
    toolbarState: {},
  };

  constructor() {
    super();
    this.handleH5Scroll = () => {
      const { engine, mobile } = this.props;
      if (mobile) {
        document.body.appendChild(Engine.$('.lake-toolbar')[0]);
        this.toolbarEl = Engine.$('.lake-toolbar');
        engine.on('select', () => {
          this.toolbarEl.css({
            position: 'absolute',
            top: `${document.body.scrollTop}px`,
          });
        });
        window.addEventListener('blur', () => {
          this.toolbarEl.css({
            position: 'fixed',
            top: 0,
          });
        });
        window.addEventListener('scroll', () => {
          if (this.toolbarEl.css('position') === 'absolute') {
            this.toolbarEl.css({
              top: `${document.body.scrollTop}px`,
            });
          }
        });
      }
    };

    this.set = (config) => {
      const { engine, type } = this.props;
      // if(type === "mini"){
      //    engine.toolbar.disable(true)
      // }else{
      const nameList = [];
      let subNameList = [];
      config.forEach((item) => {
        if (item.type === 'separator') {
          nameList.push(subNameList);
          subNameList = [];
        } else {
          subNameList.push(item.name);
        }
      });
      if (subNameList.length > 0) {
        nameList.push(subNameList);
      }
      this.setToolbar(nameList, config, true);
      // }
    };

    this.restore = () => {
      const { engine, type } = this.props;
      if (!engine.isDestroyed) {
        // if( type === "mini" ) {
        //    engine.toolbar.disable(false)
        // }else{
        this.setState({
          pluginToolbar: [],
        });
        // }
      }
    };

    this.disable = (disabled, exclude) => {
      const { engine } = this.props;
      if (!engine.isDestroyed) {
        exclude = exclude || ['save', 'undo', 'redo', 'toc'];

        const toolbarState = Object.assign({}, this.state.toolbarState);
        Object.keys(toolbarState).forEach((name) => {
          if (exclude.indexOf(name) < 0) {
            toolbarState[name].disabled = disabled;
          }
        });
        engine.toolbar.isDisabled = disabled;
        this.setState({
          toolbarState,
        });
      }
    };

    this.show = () => {
      const { engine } = this.props;
      engine.container.closest('.lake-editor').removeClass('lake-toolbar-hidden');
    };

    this.hide = () => {
      const { engine } = this.props;
      engine.container.closest('.lake-editor').addClass('lake-toolbar-hidden');
    };

    this.updateState = () => {
      const { type, engine } = this.props;
      if (!engine.isDestroyed) {
        if (type === 'mobile') {
          this.restore();
        }
        const isPluginToolbar = this.state.pluginToolbar.length > 0;
        const toolbarState = Object.assign(
          {},
          isPluginToolbar ? this.state.pluginToolbarState : this.state.toolbarState,
        );
        if (Object.keys(toolbarState).length !== 0) {
          let modified = false;
          Object.keys(toolbarState).forEach((name) => {
            if (this.executeGetter(toolbarState[name])) {
              if (!modified) {
                modified = true;
              }
            }
          });
          if (modified) {
            this.setState(
              isPluginToolbar ? { pluginToolbarState: toolbarState } : { toolbarState },
            );
          }
        }
      }
    };
  }

  componentDidMount() {
    const { toolbar, engine } = this.props;
    this.setToolbar(toolbar, toolbarConfig(engine));
    engine.toolbar = {
      set: this.set,
      updateState: this.updateState,
      restore: this.restore,
      disable: this.disable,
      show: this.show,
      hide: this.hide,
    };
    this.handleH5Scroll();
  }

  componentWillUnmount() {
    const toolbar = Engine.$('.lake-toolbar');
    const toolbarElement = toolbar ? toolbar[0] : null;
    if (toolbarElement) {
      toolbarElement.remove();
    }
  }

  setToolbar(nameList, configList, isPluginToolbar) {
    const toolbarState = {};
    const toolbarConfigMap = {};
    configList.forEach((row) => {
      toolbarConfigMap[row.name] = row;
    });

    const getKeys = (keyString) => {
      let keys = null;
      if (keyString) {
        keys = [];
        keyString.split('+').forEach((key) => {
          keys.push(key.trim(), '+');
        });
        if (keys.length > 0) delete keys[keys.length - 1];
      }
      return keys;
    };

    const setItemObject = (item) => {
      toolbarConfigMap[item.name].title = item.title || toolbarConfigMap[item.name].title;
      toolbarConfigMap[item.name].icon = item.icon || toolbarConfigMap[item.name].icon;
      const keys = getKeys(item.hotkey);
      toolbarConfigMap[item.name].hotkey = keys
        ? getHotkeyText(keys)
        : toolbarConfigMap[item.name].hotkey;
      toolbarState[item.name] = toolbarConfigMap[item.name];
      this.executeGetter(toolbarState[item.name]);
    };

    nameList.forEach((group) => {
      group.forEach((item) => {
        if (typeof item === 'object') {
          const configMap = toolbarConfigMap[item.name] || {};
          if (item.name === 'section') {
            const data = [];
            if (typeof item.items === 'object' && item.items.length > 0) {
              configMap.data.forEach((dataItem) => {
                const items = [];
                dataItem.items.forEach((sectionItem) => {
                  const childItem = item.items.find(
                    temp => (typeof temp === 'string' && temp === sectionItem.name)
                      || (typeof temp === 'object' && temp.name === sectionItem.name),
                  );
                  if (childItem) {
                    if (typeof childItem === 'object') {
                      sectionItem.title = childItem.title || sectionItem.title;
                      sectionItem.icon = childItem.icon || sectionItem.icon;
                    }
                    items.push(sectionItem);
                  }
                });
                if (items && items.length > 0) {
                  data.push({
                    title: dataItem.title,
                    items,
                  });
                }
              });
            }
            if (data.length > 0) {
              configMap.data = data;
              configMap.title = item.title || configMap.title;
              configMap.icon = item.icon || configMap.icon;
              toolbarState[item.name] = configMap;
              this.executeGetter(toolbarState[item.name]);
              return;
            }
          } else if (
            item.name === 'heading'
            || item.name === 'fontsize'
            || item.name === 'moremark'
            || item.name === 'alignment'
          ) {
            const data = [];
            if (typeof item.items === 'object' && item.items.length > 0) {
              configMap.data.forEach((dataItem) => {
                const childItem = item.items.find(
                  temp => (typeof temp === 'string' && temp === dataItem.key)
                    || (typeof temp === 'object' && temp.name === dataItem.key),
                );
                if (childItem) {
                  if (typeof childItem === 'object') {
                    if (dataItem.value && !dataItem.title) dataItem.value = childItem.title || dataItem.value;
                    dataItem.title = childItem.title || dataItem.title;

                    dataItem.icon = childItem.icon || dataItem.icon;
                  }
                  data.push(dataItem);
                }
              });
            }
            if (data.length > 0) {
              configMap.data = data;
              configMap.title = item.title || configMap.title;
              configMap.icon = item.icon || configMap.icon;
              toolbarState[item.name] = configMap;
              this.executeGetter(toolbarState[item.name]);
              return;
            }
          }
          if (item.name) {
            setItemObject(item);
          }
        } else {
          const config = toolbarConfigMap[item] || {};
          toolbarState[item] = config;
          this.executeGetter(toolbarState[item]);
        }
      });
    });

    if (isPluginToolbar) {
      this.setState({
        pluginToolbar: nameList,
        pluginToolbarState: toolbarState,
      });
    } else {
      this.setState({
        toolbar: nameList,
        toolbarState,
      });
    }
  }

  executeGetter(item) {
    const engine = this.engine;
    let modified = false;
    if (item.getActive) {
      const active = item.getActive();
      if (Array.isArray(item.active) && Array.isArray(active)) {
        const _loop = (i) => {
          if (
            item.active.find((val) => {
              return val !== active[i];
            })
          ) {
            modified = true;
          }
        };

        for (let i = 0; i < active.length; i++) {
          _loop(i);
        }
      } else if (item.active !== active) {
        modified = true;
      }
      item.active = active;
    }

    if (item.getCurrentText) {
      const currentText = item.getCurrentText(item.active);
      if (item.currentText !== currentText) {
        modified = true;
      }
      item.currentText = currentText;
    }

    if (item.getDisabled && (!engine || !engine.toolbar.isDisabled)) {
      const disabled = item.getDisabled();
      if (item.disabled !== disabled) {
        modified = true;
      }
      item.disabled = disabled;
    }
    return modified;
  }

  render() {
    const { engine, toolbar, hasMore, mobile } = this.props;
    const { toolbarState, pluginToolbar, pluginToolbarState } = this.state;

    let toolbarLength = 0;
    let pluginToolbarLength = 0;
    pluginToolbar.forEach((group) => {
      pluginToolbarLength += group.length;
    });
    toolbar.forEach((group) => {
      toolbarLength += group.length;
    });
    return (
      <div
        className={classnames('lake-toolbar', {
          'lake-mobile-toolbar': !!mobile,
        })}
        data-lake-element="toolbar"
        onMouseDown={(e) => {
          e.preventDefault();
          // fix：在搜狗浏览器上丢失选中状态
          if (!mobile) {
            engine.focus();
          }
        }}
        onMouseOver={(e) => {
          return e.preventDefault();
        }}
        onMouseMove={(e) => {
          return e.preventDefault();
        }}
        onContextMenu={(e) => {
          return e.preventDefault();
        }}
      >
        {pluginToolbar.length === 0 && (
          <div className="lake-toolbar-content lake-toolbar-content-active">
            <ToolbarPlugins hasMore={hasMore} toolbarLength={toolbarLength}>
              {toolbar.map((subToolbar, index) => {
                return (
                  <ToolbarGroup
                    {...Object.assign(
                      {
                        key: index,
                        isFirstGroup: index === 0,
                      },
                      this.props,
                      {
                        toolbarState,
                        toolbar: subToolbar,
                      },
                    )}
                  />
                );
              })}
            </ToolbarPlugins>
          </div>
        )}
        {pluginToolbar.length > 0 && (
          <div className="lake-toolbar-content lake-toolbar-content-active">
            <ToolbarPlugins hasMore={hasMore} toolbarLength={pluginToolbarLength}>
              {pluginToolbar.map((subToolbar, index) => {
                return (
                  <ToolbarGroup
                    {...Object.assign(
                      {
                        key: index,
                      },
                      this.props,
                      {
                        toolbar: subToolbar,
                        toolbarState: pluginToolbarState,
                      },
                    )}
                  />
                );
              })}
            </ToolbarPlugins>
          </div>
        )}
      </div>
    );
  }
}

Toolbar.defaultProps = {
  toolbar: [],
};
export default Toolbar;
