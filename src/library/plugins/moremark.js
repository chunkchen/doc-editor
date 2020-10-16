const PLUGIN_NAME = 'moremark';

export default {
  initialize() {
    // 创建命令
    this.command.add(PLUGIN_NAME, {
      queryState: () => {
        const list = [];
        ['sup', 'sub', 'code'].forEach((name) => {
          if (this.command.queryState(name)) {
            list.push(name);
          }
        });
        return list;
      },
      execute: (name) => {
        this.command.execute(name);
      },
    });
  },
};
