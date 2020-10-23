import Filesize from 'filesize';
import Engine from 'doc-engine/lib';
import ajax from '@itellyou/itellyou-ajax';
import locale_en from './locale/en';
import locale_zh_cn from './locale/zh-cn';
import SectionBase from '../base';

const locale = {
  en: locale_en,
  'zh-cn': locale_zh_cn,
};

const template = function (data, locale) {
  const icons = {
    video:
      '\n      <div class="lake-video-icon">\n        <svg width="32px" height="24px" viewBox="0 0 32 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.25">\n            <g transform="translate(-704.000000, -550.000000)" fill="#000000" fill-rule="nonzero">\n              <g transform="translate(704.000000, 550.000000)">\n                <g>\n                  <path d="M13.09375,17.30625 L20.65625,12.375 C20.95,12.16875 20.95,11.809375 20.65625,11.603125 L13.09375,6.696875 C12.66875,6.4 12,6.6375 12,7.084375 L12,16.921875 C12,17.365625 12.671875,17.603125 13.09375,17.30625 Z" id="Path"></path>\n                  <path d="M30,0 L2,0 C0.896875,0 0,0.896875 0,2 L0,22 C0,23.103125 0.896875,24 2,24 L30,24 C31.103125,24 32,23.103125 32,22 L32,2 C32,0.896875 31.103125,0 30,0 Z M5.25,21.25 C5.25,21.525 5.025,21.75 4.75,21.75 L2.5,21.75 C2.225,21.75 2,21.525 2,21.25 L2,18.5 C2,18.225 2.225,18 2.5,18 L4.75,18 C5.025,18 5.25,18.225 5.25,18.5 L5.25,21.25 Z M5.25,13.375 C5.25,13.65 5.025,13.875 4.75,13.875 L2.5,13.875 C2.225,13.875 2,13.65 2,13.375 L2,10.625 C2,10.35 2.225,10.125 2.5,10.125 L4.75,10.125 C5.025,10.125 5.25,10.35 5.25,10.625 L5.25,13.375 Z M5.25,5.5 C5.25,5.775 5.025,6 4.75,6 L2.5,6 C2.225,6 2,5.775 2,5.5 L2,2.75 C2,2.475 2.225,2.25 2.5,2.25 L4.75,2.25 C5.025,2.25 5.25,2.475 5.25,2.75 L5.25,5.5 Z M24.75,21.75 L7.25,21.75 L7.25,2.25 L24.75,2.25 L24.75,21.75 Z M30,21.25 C30,21.525 29.775,21.75 29.5,21.75 L27.25,21.75 C26.975,21.75 26.75,21.525 26.75,21.25 L26.75,18.5 C26.75,18.225 26.975,18 27.25,18 L29.5,18 C29.775,18 30,18.225 30,18.5 L30,21.25 Z M30,13.375 C30,13.65 29.775,13.875 29.5,13.875 L27.25,13.875 C26.975,13.875 26.75,13.65 26.75,13.375 L26.75,10.625 C26.75,10.35 26.975,10.125 27.25,10.125 L29.5,10.125 C29.775,10.125 30,10.35 30,10.625 L30,13.375 Z M30,5.5 C30,5.775 29.775,6 29.5,6 L27.25,6 C26.975,6 26.75,5.775 26.75,5.5 L26.75,2.75 C26.75,2.475 26.975,2.25 27.25,2.25 L29.5,2.25 C29.775,2.25 30,2.475 30,2.75 L30,5.5 Z" id="Shape"></path>\n                </g>\n              </g>\n            </g>\n          </g>\n        </svg>\n      </div>\n    ',
    spin:
      '\n      <i class="lake-video-anticon">\n        <svg viewBox="0 0 1024 1024" class="lake-video-anticon-spin" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">\n          <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>\n        </svg>\n      </i>\n    ',
    warn:
      '\n      <div class="lake-video-icon">\n        <svg width="41px" height="29px" viewBox="0 0 41 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n            <g transform="translate(-704.000000, -550.000000)">\n              <g id="Group-2" transform="translate(704.000000, 550.000000)">\n                <g id="video" fill="#000000" fill-rule="nonzero" opacity="0.449999988">\n                  <path d="M13.09375,17.30625 C12.671875,17.603125 12,17.365625 12,16.921875 L12,7.084375 C12,6.6375 12.66875,6.4 13.09375,6.696875 L20.65625,11.603125 C20.95,11.809375 20.95,12.16875 20.65625,12.375 L13.09375,17.30625 Z M30,0 C31.103125,0 32,0.896875 32,2 L32,22 C32,23.103125 31.103125,24 30,24 L2,24 C0.896875,24 0,23.103125 0,22 L0,2 C0,0.896875 0.896875,0 2,0 L30,0 Z M5.25,21.25 L5.25,18.5 C5.25,18.225 5.025,18 4.75,18 L2.5,18 C2.225,18 2,18.225 2,18.5 L2,21.25 C2,21.525 2.225,21.75 2.5,21.75 L4.75,21.75 C5.025,21.75 5.25,21.525 5.25,21.25 Z M5.25,13.375 L5.25,10.625 C5.25,10.35 5.025,10.125 4.75,10.125 L2.5,10.125 C2.225,10.125 2,10.35 2,10.625 L2,13.375 C2,13.65 2.225,13.875 2.5,13.875 L4.75,13.875 C5.025,13.875 5.25,13.65 5.25,13.375 Z M5.25,5.5 L5.25,2.75 C5.25,2.475 5.025,2.25 4.75,2.25 L2.5,2.25 C2.225,2.25 2,2.475 2,2.75 L2,5.5 C2,5.775 2.225,6 2.5,6 L4.75,6 C5.025,6 5.25,5.775 5.25,5.5 Z M24.75,21.75 L24.75,2.25 L7.25,2.25 L7.25,21.75 L24.75,21.75 Z M30,21.25 L30,18.5 C30,18.225 29.775,18 29.5,18 L27.25,18 C26.975,18 26.75,18.225 26.75,18.5 L26.75,21.25 C26.75,21.525 26.975,21.75 27.25,21.75 L29.5,21.75 C29.775,21.75 30,21.525 30,21.25 Z M30,13.375 L30,10.625 C30,10.35 29.775,10.125 29.5,10.125 L27.25,10.125 C26.975,10.125 26.75,10.35 26.75,10.625 L26.75,13.375 C26.75,13.65 26.975,13.875 27.25,13.875 L29.5,13.875 C29.775,13.875 30,13.65 30,13.375 Z M30,5.5 L30,2.75 C30,2.475 29.775,2.25 29.5,2.25 L27.25,2.25 C26.975,2.25 26.75,2.475 26.75,2.75 L26.75,5.5 C26.75,5.775 26.975,6 27.25,6 L29.5,6 C29.775,6 30,5.775 30,5.5 Z" id="Combined-Shape"></path>\n                </g>\n                <g id="error-fill" transform="translate(21.000000, 10.000000)">\n                  <rect id="Rectangle" fill="#000000" opacity="0" x="0" y="0" width="20" height="20"></rect>\n                  <path d="M19.0267927,16.510301 L19.0272631,16.5111171 C19.4269215,17.2064579 18.9263267,18.0729167 18.125,18.0729167 L1.875,18.0729167 C1.07367326,18.0729167 0.573078461,17.2064579 0.973207261,16.510301 L9.0970084,2.44988987 C9.28650026,2.11750251 9.63068515,1.92708333 10,1.92708333 C10.368224,1.92708333 10.7098796,2.11659543 10.9017927,2.447801 L19.0267927,16.510301 Z" id="Path" stroke="#FFFFFF" stroke-width="0.833333333" fill="#FFFFFF"></path>\n                  <path d="M18.6660156,16.71875 L10.5410156,2.65625 C10.4199219,2.44726562 10.2109375,2.34375 10,2.34375 C9.7890625,2.34375 9.578125,2.44726562 9.45898438,2.65625 L1.33398438,16.71875 C1.09375,17.1367188 1.39453125,17.65625 1.875,17.65625 L18.125,17.65625 C18.6054688,17.65625 18.90625,17.1367188 18.6660156,16.71875 Z M9.375,8.125 C9.375,8.0390625 9.4453125,7.96875 9.53125,7.96875 L10.46875,7.96875 C10.5546875,7.96875 10.625,8.0390625 10.625,8.125 L10.625,11.71875 C10.625,11.8046875 10.5546875,11.875 10.46875,11.875 L9.53125,11.875 C9.4453125,11.875 9.375,11.8046875 9.375,11.71875 L9.375,8.125 Z M10,15 C9.48242188,15 9.0625,14.5800781 9.0625,14.0625 C9.0625,13.5449219 9.48242188,13.125 10,13.125 C10.5175781,13.125 10.9375,13.5449219 10.9375,14.0625 C10.9375,14.5800781 10.5175781,15 10,15 Z" id="Shape" fill="#FAAD14" fill-rule="nonzero"></path>\n                </g>\n              </g>\n            </g>\n          </g>\n        </svg>\n      </div>\n    ',
    error: '<span class="lake-error-icon">X</span>',
  };

  if (data.status === 'uploading') {
    return '\n      <div class="lake-video">\n        <div class="lake-video-content lake-video-uploading">\n          <div class="lake-video-center">\n            '
      .concat(icons.video, '\n            <div class="lake-video-name">')
      .concat(Engine.StringUtils.escape(data.name), ' (')
      .concat(
        Filesize(data.size),
        ')</div>\n            <div data-role="progress" class="lake-video-progress">\n              ',
      )
      .concat(icons.spin, '\n              <span data-role="percent" class="percent">')
      .concat(
        Engine.StringUtils.escape(data.percent),
        '%</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    ',
      );
  }
  if (data.status === 'uploaded') {
    return '\n      <div class="lake-video">\n        <div class="lake-video-content lake-video-uploaded">\n          <div class="lake-video-center">\n            '
      .concat(icons.video, '\n            <div class="lake-video-name">')
      .concat(Engine.StringUtils.escape(data.name), ' (')
      .concat(
        Filesize(data.size),
        ')</div>\n            <div class="lake-video-converting">\n              ',
      )
      .concat(icons.spin, '\n              <span>')
      .concat(
        Engine.StringUtils.escape(locale.transcoding),
        '</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    ',
      );
  }
  if (data.status === 'error') {
    let message = '';
    /**
     * 错误码:
     * 1. reject 人工或机审不通过
     * 2. 其它类错误
     */

    switch (data.code) {
      case 'reject':
        message = locale.rejectError;
        break;

      default:
        message = locale.commonError;
        break;
    }
    // 内容审核不通过显示特殊处理
    const isReject = data.code === 'reject';
    return '\n      <div class="lake-video">\n        <div class="lake-video-content lake-video-error">\n          <div class="lake-video-center">\n            '
      .concat(isReject ? icons.warn : '', '\n            <div class="lake-video-name">')
      .concat(
        Engine.StringUtils.escape(data.name),
        '</div>\n            <div class="lake-video-message">',
      )
      .concat(isReject ? '' : icons.error)
      .concat(
        Engine.StringUtils.escape(data.message || message),
        '</div>\n          </div>\n        </div>\n      </div>\n    ',
      );
  }
  return '\n    <div class="lake-video">\n      <div class="lake-video-content lake-video-done"></div>\n    </div>\n  ';
};

class Video extends SectionBase {
  constructor(engine, contentView) {
    super();

    this.focusSection = () => {
      this.engine.change.focusSection(this.sectionRoot);
    };

    this.startChecker = (success, failed) => {
      // debug('初始化状态轮询: %j', this.value)
      const handle = () => {
        this.queryStates(
          () => {
            success();
          },
          function () {
            const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            if (err.code === 'reject') {
              failed(err);
            } else {
              setTimeout(handle, 3000);
            }
          },
        );
      };
      handle();
    };

    this.updatePlayerState = (state) => {
      this.value.aliyunVideoSrc = state.aliyunVideoSrc || null;
      this.value.taobaoVideoId = state.taobaoVideoId || null;
      this.value.uploaderId = state.userId || null;
      this.value.authKey = state.auth_key || null;
      this.setValue(this.value);
    };

    this.queryStates = (_success, failed) => {
      this.num = this.num || 0;
      this.num++;
      const options = this.getOptions().video || {};
      ajax({
        url: options.action.query,
        dataType: 'json',
        data: {
          video_id: this.value.videoId,
        },
        success: ({ result, data }) => {
          // debug('第 %d 次查询结果: %j', this.num, this.value);
          // 设置状态前先清除状态
          this.value.coverUrl = null;
          this.value.aliyunVideoSrc = null;
          this.value.taobaoVideoId = null;
          this.value.uploaderId = null;
          this.value.authKey = null;

          if (!result) {
            failed();
          } else {
            this.value.coverUrl = data.cover_url;
            this.value.aliyunVideoSrc = data.play_list[data.play_list.length - 1].url;
            _success();
          }
        },
        error(err) {
          failed({
            code: 'server-query',
          });
          // debug('状态轮询异常: %O', err)
        },
        method: 'GET',
        processData: true,
      });
    };

    this.initPlayer = (src) => {
      // 针对阿里云视频的条件
      if (this.value.aliyunVideoSrc) {
        src = this.value.aliyunVideoSrc;
      }
      this.src = Engine.StringUtils.sanitizeUrl(src);
      const video = document.createElement('video');
      video.preload = 'none';
      video.setAttribute('src', this.src);
      video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      video.setAttribute('playsinline', 'playsinline');
      if (this.value.coverUrl) {
        video.poster = this.value.coverUrl;
      }

      this.container.find('.lake-video-content').append(video);

      video.oncontextmenu = function () {
        return false;
      };
      // 一次渲染时序开启 controls 会触发一次内容为空的 window.onerror，疑似 chrome bug
      setTimeout(() => {
        video.controls = true;
        if (this.isContentView) video.controlsList = 'nodownload';
      }, 0);
    };

    this.engine = engine;
    this.contentView = contentView;
    this.isContentView = !engine;

    if (this.isContentView) {
      return this;
    }
    this.section = engine.section;
  }

  embedToolbar() {
    let toolbarExtends = [];
    const options = this.getOptions() || {};
    if (this.state.readonly && this.value.download) {
      toolbarExtends = [
        {
          type: 'download',
          onClick: this.downloadFile.bind(this),
        },
      ];
    } else if (!this.state.readonly && this.value.status === 'done') {
      toolbarExtends = [
        {
          type: 'download',
          onClick: this.downloadFile.bind(this),
        },
        {
          type: 'separator',
        },
      ];
    }
    if (options.type === 'max') {
      toolbarExtends = toolbarExtends.concat([
        {
          type: 'dnd',
        },
      ]);
    }
    let embed = toolbarExtends.concat([
      {
        type: 'delete',
      },
      {
        type: 'separator',
      },
      {
        type: 'copy',
      },
    ]);
    if (options.type === 'max') {
      embed = embed.concat([
        {
          type: 'preferences',
          onClick: () => {
            this.setSidebar();
          },
        },
      ]);
    }
    const config = options.video || {};
    if (Array.isArray(config.embed)) {
      return config.embed;
    }
    if (typeof config.embed === 'object') {
      const embedArray = [];
      embed.forEach((item) => {
        if (config.embed[item.type] !== false) {
          embedArray.push(item);
        }
      });
      return embedArray;
    }
    return embed;
  }

  setSidebar() {
    this.engine.sidebar.set({
      name: 'video',
      title: this.locale.preferences,
      className: 'lake-video-sidebar',
      data: this.value,
    });
  }

  downloadFile() {
    this.src && window.open(this.src);
  }

  activate() {
    this.container.find('.lake-video-content').addClass('lake-video-content-active');
  }

  unactivate() {
    this.container.find('.lake-video-content').removeClass('lake-video-content-active');
    if (this.engine) {
      this.engine.sidebar.restore();
    }
  }

  isEqualValue(e, t) {
    return (
      e.coverUrl === t.coverUrl
      && e.name === t.name
      && e.percent === t.percent
      && e.size === t.size
      && e.status === t.status
      && e.taobaoVideoId === t.taobaoVideoId
      && e.uploaderId === t.uploaderId
      && e.videoId === t.videoId
    );
  }

  isInWhiteList(e) {
    const src = e.aliyunVideoSrc || e.src;
    if (src) {
      try {
        const options = this.getOptions() || {};
        const hosts = options.hosts || [
          'itellyou.com',
          'www.itellyou.com',
          'cdn-video.itellyou.com',
        ];
        const hostname = new URL(src).hostname;
        if (hostname) return hosts.includes(hostname);
      } catch (e) {
      }
    }
    return true;
  }

  render(container, value) {
    this.container = container;
    this.value = value;
    this.locale = this.locale || locale[this.getLang()];
    container.empty();
    let root = Engine.$(template(this.value, this.locale));
    /**
     * 兼容老的 section 格式
     */
    if (this.value.src) {
      if (!this.isInWhiteList(this.value)) return;
      container.append(root);
      this.initPlayer(this.value.src);
      return;
    }
    const _this = this;
    if (this.isContentView) {
      if (!this.isInWhiteList(this.value)) {
        return;
      }
      /**
       * 状态为 done 的时候查询一次状态后渲染
       * 状态为 error 时候直接同步渲染
       */
      if (this.value.status === 'done') {
        this.queryStates(
          () => {
            container.append(root);
            this.initPlayer();
          },
          function () {
            const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            _this.value.status = 'error';
            _this.value.code = err.code;
            root = Engine.$(template(_this.value, _this.locale));
            container.append(root);
          },
        );
      } else if (this.value.status === 'error') {
        container.append(root);
      }
      return;
    }

    /**
     * 上传成功但未转码完成，轮询转码状态
     * 转码完成查询一次
     */

    if (this.value.status === 'uploaded') {
      container.append(root);
      this.startChecker(
        () => {
          this.value.status = 'done';
          this.setValue(this.value);
          this.render(this.container, this.value);
        },
        function () {
          const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          _this.value.status = 'error';
          _this.value.code = err.code;
          _this.setValue(_this.value);
          _this.render(_this.container, _this.value);
        },
      );
    } else if (this.value.status === 'done') {
      this.queryStates(
        () => {
          container.append(root);
          this.initPlayer();
        },
        function () {
          const err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          _this.value.status = 'error';
          _this.value.code = err.code;
          root = Engine.$(template(_this.value, _this.locale));
          container.append(root);
        },
      );
    } else {
      container.append(root);
    }
    container.on('click', this.selectSection);
    this.section.setToolbar({
      sectionRoot: this.sectionRoot,
      engine: this.engine,
      component: this,
    });
  }
}

Video.type = 'block';
Video.uid = true;
export default Video;
