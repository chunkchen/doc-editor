const lang = {
  'zh-cn': {
    next: '\u4e0b\u4e00\u5f20',
    prev: '\u4e0a\u4e00\u5f20',
    zoomIn: '\u653e\u5927',
    zoomOut: '\u7f29\u5c0f',
    originSize: '\u5b9e\u9645\u5c3a\u5bf8',
    bestSize: '\u9002\u5e94\u5c4f\u5e55',
  },
  en: {
    next: 'Next',
    prev: 'Previous',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    originSize: 'Origin Size',
    bestSize: 'Best Size',
  },
};

const data = window.appData;
const locale = data && data.locale === 'zh-cn' ? 'zh-cn' : 'en';
export default lang[locale];
