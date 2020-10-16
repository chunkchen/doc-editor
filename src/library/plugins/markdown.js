import React from 'react';
import { Button, notification } from 'antd';
import 'antd/lib/button/style';
import 'antd/lib/notification/style';
import { post } from '@itellyou/itellyou-request';
import { isMarkdown } from '../utils/string';
import Engine from '../editor/engine';

notification.config({
  top: 105,
});

function openConfirm(text, prevValue) {
  const locale = this.locale.markdown || {};
  const key = 'itellyou-paste-markdown';
  const { markdown } = this.options;
  const serviceUrl = markdown ? markdown.action : null;
  if (!serviceUrl) return;
  const onOk = () => {
    post(serviceUrl, {
      from: 'markdown',
      to: 'section',
      content: text,
    }).then((res) => {
      if (res.result) {
        const data = res.data;
        this.history.stop();
        this.change.setValue(prevValue);
        this.command.execute('paste', data.content);
        this.history.save();
        notification.close(key);
      }
    });
  };

  const btn = (
    <Button type="primary" size="small" onClick={onOk}>
      {locale.pasteButton}
    </Button>
  );

  notification.open({
    placement: 'topRight',
    message: locale.pasteTitle,
    description: locale.pasteContent,
    btn,
    key,
  });
}

export default {
  initialize() {
    // 监听粘贴文本事件
    this.on('paste:string', (data, prevValue) => {
      // command+shift+v 纯文本粘贴，不处理
      if (data.isPasteText) {
        return;
      }

      let text = '';
      const html = data.html || '';

      if (html) {
        text = new Engine.HTMLParser(html).toText();
      } else if (data.text) {
        text = data.text;
      }
      // 没有检测到 markdown 文本
      if (!isMarkdown(data)) {
        return;
      }
      // 提示 markdown 粘贴

      openConfirm.call(this, text, prevValue);
    });
  },
};
