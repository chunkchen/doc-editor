/**
 * @fileOverview command util
 */

/**
 * 添加界面功能命令
 * 如：呼出大纲、翻译、查找、替换
 * @param  {Object} engine - 编辑器引擎
 * @param  {String} name - 侧栏功能名称
 * @param  {Function} getConfig - 获得侧栏配置项方法
 * @param  {String} ui - 界面组建
 */
const addUiCommand = (engine, name, getConfig, ui, autoSave) => {
  engine.command.add(name, {
    autoSave: () => {
      return autoSave;
    },
    queryState: () => {
      if (!engine[ui]) {
        return false;
      }
      // 判断一：以一个特殊属性，区分是否是 editor 拓展后的 engine
      // 判断二：以本地缓存区分是否该执行相应命令
      return engine[ui].storeConfig && localStorage.getItem(`lake-${ui}`) === name;
    },
    execute: (force) => {
      if (force === true || !engine.command.queryState(name)) {
        const config = getConfig.call(engine);
        engine[ui].store(config);
        engine[ui].set(config);
        return;
      }
      engine[ui].close();
    },
  });
};

export const addSidebarCommand = (engine, name, getConfig) => {
  addUiCommand(engine, name, getConfig, 'sidebar');
};

export const addDialogCommand = (engine, name, getConfig) => {
  addUiCommand(engine, name, getConfig, 'dialog');
};

export const addIframeSection = (engine, name, value) => {
  const {locale, iframeHelper} = engine;
  if (iframeHelper.canAdd()) {
    engine.command.execute(name, value);
  } else {
    const limit = iframeHelper.options.limit;
    engine.messageError(locale.section.iframeOverLimit.replace('${limit}', limit));
  }
};
