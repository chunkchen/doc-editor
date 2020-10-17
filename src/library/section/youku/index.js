import EmbedUrl from '../embed/url';

function getDocEmbedURL(url) {
  // 优酷
  let match = url.match(/^https?:\/\/\w+\.youku\.com\/v_show\/id_([^\\.]+)/i);
  let id;
  if (match) {
    id = match[1];
    return 'https://player.youku.com/embed/'.concat(id);
  }
  // BiliBili
  if (url.startsWith('https://player.bilibili.com/player.html?')) return url;
  if (url.startsWith('http://player.bilibili.com/player.html?')) return url.replace(/^http:/i, 'https:');
  // BiliBili av
  match = url.match(/^https?:\/\/\w+\.bilibili\.com\/video\/av(\d+)/i);
  if (match) {
    id = match[1];
    let p = url.match(/p=(\d+)/);
    if (p) p = p[1];
    return 'https://player.bilibili.com/player.html?aid='
      .concat(id)
      .concat(p ? '&p='.concat(p) : '');
  }
  // BiliBili bv
  const urlObj = new URL(url, window.location.origin);
  match = (urlObj.origin + urlObj.pathname).match(
    /^https?:\/\/\w+\.bilibili\.com\/video\/(bv[^\/]+)\/?$/i,
  );
  if (match) {
    let search;
    id = match[1];
    if (/\b(?:p=(\d+))/.test(urlObj.search)) {
      search = RegExp.$1;
    }
    return 'https://player.bilibili.com/player.html?bvid='
      .concat(id)
      .concat(search ? '&p='.concat(search, '&page=').concat(search) : '');
  }
}

function hitBlack(url) {
  return !url.match(/^https:.*\.youku\.com\//) && !url.match(/^https:.*\.bilibili\.com\//);
}

class YouKu extends EmbedUrl {
  constructor(cfg) {
    super({
      resize: false,
      ...cfg,
    });
  }

  getHeight() {
    return this.getContainerWidth() / (16 / 9);
  }

  getPlaceHolder() {
    const lang = this.getLang();
    return lang === 'en'
      ? 'Please enter a video link to support Youku, Bilibili'
      : '请输入视频链接，支持优酷、哔哩哔哩';
  }

  hitBlack(url) {
    return hitBlack(url);
  }

  getDocEmbedURL(url) {
    return getDocEmbedURL(url);
  }

  isError() {
    return window.appData && window.appData.isWechatMiniApp !== undefined
      ? window.appData.isWechatMiniApp
      : false;
  }

  renderError() {
    this.container.append(
      '\n      <div class="youku-error">\n        <p><span class="lake-icon lake-icon-warning"></span></p>\n        <p>'.concat(
        this.locale.wechatAlert,
        '</p>\n      </div>\n    ',
      ),
    );
  }
}

YouKu.type = 'block';
export default YouKu;
export { hitBlack, getDocEmbedURL };
