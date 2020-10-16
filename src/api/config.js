import axios from 'axios';
import { message } from 'antd';
import { getRequestId, getToken, removeAll, updateRequestId } from '../util/auth';

message.config({
  duration: 3,
  maxCount: 1,
});

axios.defaults.baseURL = 'http://10.50.12.37:5088';
// axios.defaults.baseURL = 'http://127.0.0.1:5088';
axios.defaults.timeout = 5000;

// 这里发送每个请求 都会带上 requestId ， 在有响应时 会更新 requestId， 也就是说，后端将会对 一定时间内 所有接口请求频次有限制

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (!token) {
    goLoginPage();
  }
  config.headers.authorization = token;
  config.headers.requestId = getRequestId();
  return config;
}, (error) => {
  console.error(error);
  return Promise.reject(error);
},);

axios.interceptors.response.use((response) => {
  updateRequestId();
  const { code, msg } = response.data;
  if (response.data.size) {
    return response;
  }
  if (code && code !== '200') {
    // 统一提示 业务异常响应
    message.error(msg);
    return Promise.reject(msg);
  }
  return response;
}, (error) => {
  const { response } = error;


  if (!response) {
    message.error('系统链接超时');
  } else {
    const { status, statusText } = response;
    if (status === 403 && statusText === 'Forbidden') {
      goLoginPage();
    } else {
      message.error(`${status}, ${statusText}`);
    }
  }
  return Promise.reject(error);
},);

function goLoginPage() {
  removeAll();
  message.error('登陆过期,请重新登陆');
  window.location.replace(`${window.location.protocol}//${window.location.host}/#/user/login`);
}

export default axios;
