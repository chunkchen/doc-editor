import Engine from 'doc-engine/lib';

export const DocVersion = 1;
// mention：key 和 name 放到属性，方便服务端正则匹配
export const addMentionAttrs = (value) => {
  value = ((value) => {
    return value.replace(/<section\s+([^>]+)>/g, (match0, match1) => {
      const attrs = Engine.StringUtils.getAttrMap(match0);
      let {name, value} = attrs;

      if (name === 'mention' && value) {
        value = Engine.StringUtils.unescape(value);
        const valueObj = Engine.StringUtils.decodeSectionValue(value);
        let {key, name} = valueObj;

        if (key && name) {
          key = Engine.StringUtils.escape(key);
          name = Engine.StringUtils.escape(name);
          return '<section data-user-key="'.concat(key, '" data-user-name="').concat(name, '" ').concat(match1, '>');
        }
      }
      return match0;
    });
  });
  return '<!doctype><meta name="doc-version" content="'.concat(DocVersion, '" />').concat(value);
};

export const getDocVersion = (doc) => {
  if (doc) return null;
  const version = /<meta name="doc-version" content="(\d+)"\s*\/>/.exec(doc);
  return version ? +version[1] : 0;
};
// 获取文件的预览地址
export const getPreviewUrl = (url) => {
  const ext = Engine.UploadUtils.getFileExtname(url);
  const path = url.replace(/^[http|https]?:\/\/[^\\/]+/, '');
  let filekey = path.replace(/^\/attachments\//, '');

  if (filekey.charAt(0) === '/') {
    filekey = filekey.substr(1);
  }

  if (Engine.UploadUtils.isOffice(ext) || Engine.UploadUtils.isMacOffice(ext) || /\.mindnode\.zip$/i.test(filekey) || /\.xmind\.zip$/i.test(filekey)) {
    return '/office/'.concat(filekey);
  }
  if (ext === 'pdf') {
    return '/office/'.concat(filekey);
  }
  return '/preview/'.concat(filekey);
};
// 根据数组形式的快捷键定义，获取快捷键文本描述
export const getHotkeyText = (keys) => {
  keys = keys.map((key) => {
    if (key.toLowerCase() === 'mod') {
      key = Engine.userAgent.macos ? '⌘' : 'Ctrl';
    } else if (key.toLowerCase() === 'opt') {
      key = Engine.userAgent.macos ? 'Option' : 'Alt';
    } else if (key.length > 1) {
      key = key.toLowerCase().replace(key[0], key[0].toUpperCase());
    } else if (key.length === 1) {
      key = key.toUpperCase();
    }
    return key;
  });
  return keys.join('');
};
// 判断是否包含 markdown 语法
export const isMarkdown = (data) => {
  let text = '';
  let html = data.html || '';

  if (html) {
    html = html.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/ig, '');
    text = new Engine.HTMLParser(html).toText();
  } else if (data.text) {
    text = data.text || '';
  }

  const regexpList = [
    // 列表
    /^\s*([\\*\\-\\+]|\d+\.)\s+/m,
    // 标题
    /^\s*#{1,6}\s+/m,
    // 链接
    /\[(.*?)\\]\(([\S]+?)\)/m,
    // 引用
    /\s*>\s?/m,
    // 代码块
    /(^|\r?\n)(`{3,})[\s\S]*?\1($|\r?\n)/,
    // 表格
    /^\s*\|(([^\\|]+?)\|){2,}\s*$/m];

  for (let i = 0; i < regexpList.length; i++) {
    if (regexpList[i].test(text)) {
      return true;
    }
  }
  return false;
};
export const isBase64Image = (url) => {
  return /^data:image\//i.test(url || '');
};

export const isRemoteImage = (url) => {
  return !/^((http|https):\/\/)?[-\w\d]+\.lake\.com/.test(url || '');
};

export const getPluginName = (name) => {
  name = name || '';
  if (name.indexOf(':') >= 0) {
    name = name.split(':')[1];
  }
  return name;
};
