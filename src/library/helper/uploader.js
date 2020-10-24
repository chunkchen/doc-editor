import {EventEmitter2} from 'eventemitter2';
import {message} from 'antd';
import Engine from 'doc-engine/lib';
import {isBase64Image} from '../utils/string';
import Request from './request';

const { android } = Engine.userAgent;
const request = new Request();
const ajax = (options) => {
  return request.ajax(options);
};

class Uploader extends EventEmitter2 {
  constructor(options) {
    super();
    this.options = Object.assign({}, options, {
      cache: {},
    });
    this.uploadingSections = {};
    this.uploadingFiles = {};
    this.updateHistorySection = {};
    this.sectionIds = {};
  }

  getUid(text) {
    return `${Date.now()}-${text}`;
  }

  addUploadingSection(uid, section) {
    this.uploadingSections[uid] = section;
  }

  getAccept(itemName) {
    if (itemName === 'image') {
      return android ? 'image/*' : Engine.EXTS.IMAGE_EXT_STR;
    }
    if (itemName === 'file') {
      return Engine.EXTS.FILE_EXT_STR;
    }
    if (itemName === 'localdoc') {
      return Engine.EXTS.OFFICE_EXT_STR; // + ", " + Engine.EXTS.MAC_OFFICE_STR
    }
    return undefined;
  }

  getAllowedExtensions(itemName) {
    return itemName === 'image' ? Engine.EXTS.IMAGE_EXT_STR : this.getAccept(itemName) || '';
  }

  parseExtension(file) {
    const ext = Engine.UploadUtils.getFileExtname(file);
    const extension = {
      raw: ext,
      actual: ext,
    };
    if (/\.mindnode\.zip$/.test(file.name)) {
      extension.actual = 'mindnode';
    } else if (/\.xmind\.zip$/.test(file.name)) {
      extension.actual = 'xmind';
    }
    return extension;
  }

  async request(type, files, options) {
    const { engine } = this.options;
    const { onBeforeUpload, onAfterUpload } = options;

    const uidList = files.map((file, index) => {
      if (!file.uid) {
        file.uid = this.getUid(index);
      }
      return file.uid;
    });
    let i = 0;
    for (; i < files.length; i++) {
      const file = files[i];
      const beforeResult = await this.handleBeforeUpload(type, file, files, options);
      if (!beforeResult) {
        delete this.uploadingFiles[beforeResult.uid];
      }
    }

    if (onBeforeUpload) {
      onBeforeUpload();
    }

    const upload = async () => {
      for (; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        const sectionId = this.sectionIds[file.uid];
        if (sectionId) {
          formData.append('element_id', sectionId);
        }
        formData.append('file', file, file.name);
        let options = this.options.engine.options[type];
        if (type === 'localdoc' && !options) options = this.options.engine.options.file;
        const action = options.action;
        const locale = engine.locale[type] || {};
        await ajax({
          xhr: () => {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener(
              'progress',
              (evt) => {
                if (evt.lengthComputable) {
                  this.handleChange(type, 'uploading', {
                    uid: file.uid,
                    progress: {
                      percent: parseInt((evt.loaded / evt.total) * 100, 10),
                    },
                  });
                }
              },
              false,
            );
            return xhr;
          },
          url: action,
          data: formData,
          dataType: 'json',
          success: ({ result, data, message }) => {
            if (result) {
              const { url, preview, download, size, width, height } = data;
              this.handleChange(type, 'done', {
                uid: file.uid,
                uidList,
                src: url,
                preview,
                download,
                size,
                width,
                height,
              });
            } else {
              this.handleChange(type, 'error', {
                uid: file.uid,
                uidList,
                message,
              });
            }
          },
          error: (err) => {
            let message = '';
            if (err && err.xhr && err.xhr.response) {
              try {
                message = JSON.parse(err.xhr.response).message || '';
              } catch (e) {
                message = '';
              }
            } else {
              message = err.message;
            }
            if (!message) {
              message = locale.uploadFailed;
            }
            this.handleChange(type, 'error', {
              uid: file.uid,
              uidList,
              message,
            });
          },
          method: 'POST',
          processData: true,
        });
      }
    };
    i = 0;
    upload();
    if (onAfterUpload) {
      onAfterUpload();
    }
  }

  post(type, files) {
    const options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    if (type === 'file') {
      files = files.filter((file) => {
        return Engine.UploadUtils.isFile(file);
      });
    } else if (type === 'image') {
      files = files.filter((file) => {
        return Engine.UploadUtils.isImage(file);
      });
    } else if (type === 'localdoc') {
      files = files.filter((file) => {
        return Engine.UploadUtils.isFile(file);
      });
    }
    if (files.length !== 0) {
      this.request(type, files, options);
      return true;
    }
  }

  handleBeforeUpload(type, file, files, options) {
    const { onBeforeInsertSection } = options;
    const { engine } = this.options;
    const { iframeHelper } = engine;
    const { uid, name, size } = file;
    const fileType = file.type;
    const extension = this.parseExtension(file);
    let { sizeError } = engine.locale[type];
    if (type === 'localdoc' && !iframeHelper.canAdd()) {
      engine.messageError(
        engine.locale.section.iframeOverLimit.replace('${limit}', iframeHelper.options.limit),
      );
      return false;
    }
    const allowedExts = this.getAllowedExtensions(type);
    if (!extension.actual || (allowedExts && allowedExts.indexOf(extension.actual) < 0)) {
      engine.messageError(engine.locale[type].formatError);
      return false;
    }
    let docType = type;
    if (type === 'localdoc') {
      if (Engine.UploadUtils.isOffice(file)) {
        docType = 'previewOffice';
        sizeError = engine.locale.preview.office;
      } else if (
        Engine.UploadUtils.isMacOffice(file)
        || extension.actual === 'mindnode'
        || extension.actual === 'xmind'
      ) {
        docType = 'previewMacOffice';
        sizeError = engine.locale.preview.macOffice;
      }
    }
    if (!Engine.UploadUtils.isSizeLimit(docType, size)) {
      message.error(sizeError);
      return false;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener(
        'load',
        () => {
          let handle = true;
          this.uploadingFiles[uid] = {
            uid,
            src: fileReader.result,
            name,
            size,
            type: fileType,
            ext: extension.raw,
            progress: {
              percent: 0,
            },
          };
          for (let l = 0; files.length > l; l++) {
            if (!this.uploadingFiles[files[l].uid]) {
              handle = false;
              break;
            }
          }
          if (handle) {
            files.forEach((file) => {
              this.handleChange(type, 'before', this.uploadingFiles[file.uid], {
                file,
                onBeforeInsertSection,
              });
              delete this.uploadingFiles[file.uid];
            });
          }
          resolve(file);
        },
        false,
      );

      fileReader.addEventListener('error', () => {
        reject(file);
      });

      fileReader.readAsDataURL(file);
    });
  }

  handleChange(type, status, data) {
    const options = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    const { engine } = this.options;
    const { uid, uidList } = data;
    const fileOptions = Object.assign({}, data);
    const { onBeforeInsertSection, file } = options;
    if (type === 'image' && isBase64Image(fileOptions.src)) {
      delete fileOptions.src;
    }
    fileOptions.status = status;
    if (status !== 'before') {
      const section = this.uploadingSections[uid];
      if (section && section.closest('body').length !== 0) {
        if (status !== 'uploading') {
          if (status === 'error') {
            const msg = fileOptions.message || engine.locale[type].uploadFailed;
            message.error(msg);
          }
          delete this.uploadingSections[uid];
          delete this.uploadingFiles[uid];
          Engine.UploadUtils.updateSection(
            engine,
            section,
            fileOptions,
            this.updateHistorySection[uid],
          );
        } else {
          Engine.UploadUtils.updateSectionProgress(section, fileOptions);
        }
      } else {
        delete this.uploadingSections[uid];
      }
    } else {
      if (onBeforeInsertSection) {
        onBeforeInsertSection(file, fileOptions);
      }

      if (this.uploadingSections[uid]) {
        this.updateHistorySection[uid] = true;
      } else {
        const section = Engine.UploadUtils.insertSection(engine, type, fileOptions);
        const id = section.attr('id');
        if (id) {
          this.sectionIds[uid] = id;
        }
        this.addUploadingSection(uid, section);
      }
    }
  }
}

export default Uploader;
