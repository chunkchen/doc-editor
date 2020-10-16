import { ListRoleApi, ListUserApi } from './api/user';

const cacheSuffix = '_session_cache';

/**
 * 用户角色信息
 * @type {string}
 */
const USR_ROLE_CACHE_KEY = `user_roles${cacheSuffix}`;

/**
 * 用户列表缓存key
 * @type {string}
 */
const USER_LIST_CACHE_KEY = `user_list${cacheSuffix}`;

class CacheService {
  /**
   * 获取系统可用角色列表
   * @returns {Promise<*>}
   */
  static async getSysRoleListCache() {
    let roleList = [];
    const tempData = sessionStorage.getItem(USR_ROLE_CACHE_KEY);
    if (tempData) {
      roleList = JSON.parse(tempData);
    } else {
      await ListRoleApi().then((res) => {
        if (res.msg === 'SUCCESS' && res.data) {
          sessionStorage.setItem(USR_ROLE_CACHE_KEY, JSON.stringify(res.data));
          roleList = res.data;
        }
      });
    }
    return roleList;
  }

  static resetRoleListCache() {
    sessionStorage.removeItem(USR_ROLE_CACHE_KEY);
    this.getSysRoleListCache();
  }

  /**
   * 获取 标注 TAG 列表
   * @returns {Promise<*>}
   */
  static async getUserListCache() {
    let userList = [];
    const tempData = sessionStorage.getItem(USER_LIST_CACHE_KEY);
    if (tempData && tempData !== '[]') {
      userList = JSON.parse(tempData);
    } else {
      await ListUserApi().then((res) => {
        if (res.msg === 'SUCCESS' && res.data) {
          sessionStorage.setItem(USER_LIST_CACHE_KEY, JSON.stringify(res.data));
          userList = res.data;
        }
      });
    }
    return userList;
  }

  /**
   * 创建用户后 调用
   */
  static resetUserListCache() {
    sessionStorage.removeItem(USER_LIST_CACHE_KEY);
    this.getUserListCache();
  }
}

export default CacheService;
