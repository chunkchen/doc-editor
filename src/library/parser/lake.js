import Engine from 'doc-engine/lib';
import schema_config from '../schema/config';
import lang_cn from '../lang/zh-cn';
import {addMentionAttrs} from '../utils/string';
import HtmlParser from './html';

export default (text) => {
  const root = document.createElement('div');
  const child = document.createElement('div');
  root.style.display = 'none';
  root.appendChild(child);
  document.body.appendChild(root);

  const engine = Engine.create(child, {
    onBeforeRenderImage: (url) => {
      return url;
    },
  });
  engine.schema.add(schema_config);
  engine.locale = lang_cn;
  engine.setValue('<p><cursor /></p>');
  engine.command.execute('paste', text);
  const value = addMentionAttrs(engine.getValue());
  const html = engine.getHtml(new HtmlParser());
  engine.destroy();
  document.body.removeChild(root);
  return {
    value,
    html,
  };
};
