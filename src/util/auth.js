import Cookies from 'js-cookie';
import { getUuid } from './stringUtils';

const TokenKey = 'User-Token';
const RoleKey = 'User-Role';
const UserInfoKey = 'User-Info';

export function checkUserHaveLogin() {
  return !!Cookies.get(TokenKey) && !!Cookies.get(RoleKey) && !!Cookies.get(UserInfoKey);
}

// js-cookie expires 单位是 天
export function setToken(token, expires) {
  Cookies.set(TokenKey, token, { expires: expires / (24 * 3600) });
}

export function setRoles(roles, expires) {
  Cookies.set(RoleKey, roles, { expires: expires / (24 * 3600) });
}

export function setUserInfo(userInfo, expires) {
  Cookies.set(UserInfoKey, userInfo, { expires: expires / (24 * 3600) });
}

export function getToken() {
  return Cookies.get(TokenKey);
}

export function getRoles() {
  return Cookies.get(RoleKey);
}

export function getUserInfo() {
  return Cookies.get(UserInfoKey);
}

export function removeAll() {
  localStorage.clear();
  sessionStorage.clear();
  Cookies.remove(TokenKey);
  Cookies.remove(RoleKey);
  Cookies.remove(UserInfoKey);
}

export function getRequestId() {
  let requestId = sessionStorage.getItem('requestId');
  if (!requestId) {
    requestId = getUuid();
    sessionStorage.setItem('requestId', requestId);
  }
  return requestId;
}

export function updateRequestId() {
  sessionStorage.setItem('requestId', getUuid());
}

/**
 * 根据需要的角色，判断用户是否拥有权限
 * @param roles 需要的角色 list
 * @returns {boolean} true 有权限， false 无权限
 */
export function checkHaveAuthByRequireRoles(roles) {
  const userRoles = getRoles();
  return userRoles && !!roles.find(role => userRoles.indexOf(role) !== -1);
}
