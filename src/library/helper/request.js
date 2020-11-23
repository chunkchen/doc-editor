import ajax from '../network/ajax'

class Request {
  constructor(options) {
    this.options = { ajaxOptions: {
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
    ...options }
  }

  ajax(options) {
    options = { ...this.options.ajaxOptions, ...options }
    const { success, error } = options
    const promise = new Promise((resolve) => {
      options.success = (res) => {
        success(res)
        resolve()
      }
      options.error = (res) => {
        error(res)
        resolve()
      }
    })
    return {
      xhr: ajax(options),
      promise,
    }
  }
}

export default Request
