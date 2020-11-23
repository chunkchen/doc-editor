const appData = window.appData
export default {
  locale: appData && appData.locale ? appData.locale : 'zh-cn',
}
