import axios from '../config';

/**
 * 登录
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const LoginApi = params => axios.post('/ajax/auth/login', params)
  .then(res => res.data);

/**
 * 分页查询用户列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const PageListUserApi = params => axios.get('/ajax/user/management/pageListUser', { params })
  .then(res => res.data);


/**
 * 获取系统可用角色列表
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const ListRoleApi = () => axios.get('/ajax/user/management/listRole')
  .then(res => res.data);


/**
 * 编辑用户
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const ModifyUserInfoApi = params => axios.post('/ajax/user/management/modifyUserInfo', params)
  .then(res => res.data);

/**
 * 创建用户
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const AddUserApi = params => axios.post('/ajax/user/management/addUser', params)
  .then(res => res.data);


/**
 * 获取用户列表（用户名，ID， 昵称）
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const ListUserApi = () => axios.get('/ajax/userInfo/listUser')
  .then(res => res.data);
