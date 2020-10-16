import { ListRoleApi } from './api/user';

const cacheSuffix = '_session_cache';

/**
 * 用户角色信息
 * @type {string}
 */
const USR_ROLE_CACHE_KEY = `user_roles${cacheSuffix}`;

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
}

export default CacheService;
