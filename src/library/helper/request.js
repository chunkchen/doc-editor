import ajax from '@itellyou/itellyou-ajax';

class Request {
  constructor(options) {
    this.options = Object.assign({
      ajaxOptions: {
        progress() {
        },
        error() {
        },
        success() {
        },
        data: {},
        method: 'post',
        url: '',
      },
    }, options);
  }

  ajax(options) {
    options = Object.assign({}, this.options.ajaxOptions, {}, options);
    const { success, error } = options;
    const promise = new Promise((resolve) => {
      options.success = (res) => {
        success(res);
        resolve();
      };
      options.error = (res) => {
        error(res);
        resolve();
      };
    });
    return {
      xhr: ajax(options),
      promise,
    };
  }
}

export default Request;
