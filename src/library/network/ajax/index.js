import Url from 'url'
import request from './request'
import loadIframe from './loadIframe'
import {
  endsWith,
  getTokenFromCookie,
  isAFormData,
  startsWith,
  TOKEN,
  toQueryString,
  urlAppend,
  urlNeedPatch,
} from './utils'

const TS = '_ts'
const CHARSET_KEY = '_input_charset'
const UTF8 = 'utf-8'
const globalSetupOptions = {
  iframeProxyUrl: '/proxy.html',
  useIframeProxy: false,
  withToken: true,
  withInputCharset: true,
  cache: true,
}
const hostname = window.location.hostname // 不考虑端口...
function patch(opt_) {
  const win = arguments.length <= 1 || arguments[1] === undefined ? window : arguments[1]
  const opt = opt_
  const cache = globalSetupOptions.cache || opt.method === 'post'
  const token = getTokenFromCookie(win)
  const withToken = globalSetupOptions.withToken
  const withInputCharset = globalSetupOptions.withInputCharset

  let extraData
  opt.data = opt.data || {}
  if (Array.isArray(opt.data)) {
    extraData = []
    if (withToken && token) {
      extraData.push({
        name: TOKEN,
        value: encodeURIComponent(token),
      })
    }
    if (withInputCharset) {
      extraData.push({
        name: CHARSET_KEY,
        value: UTF8,
      })
    }
    if (!cache) {
      extraData.push({
        name: TS,
        value: Date.now(),
      })
    }
    opt.data = opt.data.concat(extraData)
  } else if (typeof opt.data === 'string') {
    if (withInputCharset && opt.data.indexOf(CHARSET_KEY) === -1) {
      opt.data += `&${CHARSET_KEY}=${UTF8}`
    }
    if (withToken && token && opt.data.indexOf(TOKEN) === -1) {
      // 字符串形式的 jquery 不会 encode
      opt.data += `&${TOKEN}=${encodeURIComponent(token)}`
    }
    if (!cache) {
      opt.data += `&${TS}=${Date.now()}`
    }
  } else if (isAFormData(opt.data)) {
    if (withInputCharset && !opt.data.get(CHARSET_KEY)) {
      opt.data.append(CHARSET_KEY, UTF8)
    }
    if (opt.url && withToken && token) {
      opt.url = urlAppend(opt.url, toQueryString({ [TOKEN]: token }))
    }
  } else {
    if (withInputCharset) {
      opt.data[CHARSET_KEY] = UTF8
    }
    if (!cache) {
      opt.data[TS] = Date.now()
    }
    if (withToken && token && !opt.data[TOKEN]) {
      opt.data[TOKEN] = token
    }
  }
  return opt
}

function newAjax(_url, callback) {
  let opt
  let url = _url
  if (typeof url === 'string') {
    opt = {
      url,
      success: callback,
    }
  } else {
    opt = url
  }

  url = opt.url
  const req = request()

  if (startsWith(url, '//')) {
    url = window.location.protocol + url
  }

  if (opt.type !== 'jsonp') {
    let useIframeProxy = globalSetupOptions.useIframeProxy
    if ('useIframeProxy' in opt) {
      useIframeProxy = opt.useIframeProxy
    }

    if (useIframeProxy && startsWith(url, 'http:') || startsWith(url, 'https:')) {
      const myUrl = Url.parse(url)
      const myHostname = myUrl.hostname
      if (myHostname !== hostname) {
        const iframeProxyUrl = opt.iframeProxyUrl || globalSetupOptions.iframeProxyUrl
        if (endsWith(myHostname, document.domain)) {
          loadIframe(`${myUrl.protocol}//${myUrl.host}${iframeProxyUrl}`, (error, iframe) => {
            if (error) {
              req.setup(opt)
              req.triggerError(error)
            } else {
              opt.context = iframe.contentWindow
              // 如果是 cdn 则不处理
              if (urlNeedPatch(url)) {
                opt = patch(opt, opt.context)
              }
              req.start(opt)
            }
          })
          return req
        }
        // cors
      }
    }
  }

  // 如果是 cdn 则不处理
  if (urlNeedPatch(url)) {
    opt = patch(opt)
  }
  req.start(opt)
  return req
}

newAjax.ajaxSetup = (options) => {
  for (const k in options) {
    if (options.hasOwnProperty(k) && globalSetupOptions.hasOwnProperty(k)) {
      globalSetupOptions[k] = options[k]
    }
  }
  request.ajaxSetup(options)
}
export default newAjax
