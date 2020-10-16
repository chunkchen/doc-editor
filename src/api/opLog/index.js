import axios from '../config';

export const PageLoginLogApi = params => axios.get('/ajax/management/pageListLoginLog', { params })
  .then(res => res.data);
