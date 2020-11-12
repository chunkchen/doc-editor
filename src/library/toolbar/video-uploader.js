import lodashGet from 'lodash/get';
import ajax from '@itellyou/itellyou-ajax';
import { message } from 'antd';
import 'antd/lib/message/style';

class VideoUploader {
  constructor(options) {
    this.trigger = options.trigger;
    this.engine = options.engine;
    this.onToolBarClick = options.onToolBarClick;
    this.onToolBarError = options.onToolBarError;
    this.sectionRoot = null;
    this.selectedFile = null;
    this.data = {};
    this.initUploader();
  }

  initUploader() {
    const VodUploader = lodashGet(window, 'AliyunUpload.Vod');

    if (!VodUploader || !this.trigger) {
      message.error('Not found AliyunUpload.Vod');
      return;
    }

    const options = this.engine.options.video || {};
    const uploader = new VodUploader({
      timeout: options.timeout || 60 * 1000,
      partSize: options.partSize || 1048576,
      parallel: options.parallel || 5,
      retryCount: options.retryCount || 3,
      retryDuration: options.retryDuration || 2,
      region: options.region || '',
      userId: options.user_id || '',
      addFileSuccess: (uploadInfo) => {
        // 触发外围 toolbar 的 click 事件， 用于选择文件后关闭菜单
        this.onToolBarClick();
        const { key, file } = uploadInfo;
        // debug('上传:文件选择: %j', file)
        this.selectedFile = file;
        // 选定文件后，执行插入Section
        this.insertSection(key, file);
        uploader.startUpload();
      },
      // 开始上传
      onUploadstarted: (uploadInfo) => {
        const filename = uploadInfo.file.name;
        const filesize = uploadInfo.file.size;
        ajax({
          url: options.action.create,
          dataType: 'json',
          data: {
            filename,
            filesize,
          },
          success: ({ result, data, message }) => {
            if (!result) {
              message.error(message);
              return;
            }
            const UploadAuth = data.UploadAuth || data.upload_auth;
            const UploadAddress = data.UploadAddress || data.upload_address;
            const VideoId = data.VideoId || data.video_id;
            uploadInfo.key = data.key;
            uploader.setUploadAuthAndAddress(uploadInfo, UploadAuth, UploadAddress, VideoId);
          },
          error: () => {
            this.onToolBarError({
              code: -100,
            });
          },
          method: 'GET',
          processData: true,
        });
      },
      // 文件上传成功
      onUploadSucceed: (uploadInfo) => {
        const { videoId, file, key } = uploadInfo;
        const { name, size, type } = file;
        let fileType = name.split('.')
          .pop();
        if (fileType) {
          fileType = '.'.concat(fileType);
        }
        ajax({
          method: 'POST',
          url: options.action.save,
          dataType: 'json',
          data: {
            key,
            filename: name,
            filesize: size,
            filetype: type || fileType || 'unknow',
            video_id: videoId,
          },
          success: () => {
            this.updateSection({
              status: 'uploaded',
              videoId,
              key,
            });
          },
          error: () => {
            this.onToolBarError({
              code: -100,
            });
          },
          processData: true,
        });
      },
      // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
      onUploadProgress: (uploadInfo, totalSize, progress) => {
        const progressPercent = Math.ceil(progress * 100);
        // debug('上传:进度: %j', progressPercent)
        // 不直接显示 100%，为截图服务和保存服务耗费的时间预留buffer

        if (progressPercent > 98) {
          return;
        }

        this.updatePercent({
          percent: progressPercent,
        });
      },
    });
    this.trigger.addEventListener(
      'change',
      (e) => {
        const file = e.target.files[0];
        uploader.addFile(file, null, null, null, null);
        this.trigger.value = '';
      },
      false,
    );
    window.uploader = uploader;
  }

  insertSection(key, file) {
    const engine = this.engine;
    this.data = {
      key,
      status: 'uploading',
      name: file.name,
      size: file.size,
      percent: 0,
    };
    engine.history.stop();
    this.sectionRoot = engine.change.insertSection('video', this.data);
    engine.history.start();
  }

  updatePercent(file) {
    this.sectionRoot.find('[data-role=percent]')
      .html(''.concat(file.percent, '%'));
  }

  updateSection() {
    const data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.data = Object.assign(this.data, data);
    this.engine.change.updateSection(this.sectionRoot, this.data);
  }
}

export default VideoUploader;
