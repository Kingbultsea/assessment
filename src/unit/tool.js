/* eslint-disable */

export default class Tool {
  // 是否为APP
  static is_cosleep () {
    return this.is_cosleep_android() || this.is_cosleep_ios()
  }

  // 是否为小睡眠app ios版
  static is_cosleep_ios () {
    let ios = false
    try {
      ios = typeof
      window.webkit.messageHandlers.XinchaoApp !== 'undefined'
    } catch (e) {
      //
    }
    return ios
  }

  // 是否为小睡眠app 安卓版
  static is_cosleep_android () {
    return typeof window.XinchaoApp !== 'undefined'
  }

  // API请求基地址
  static get_api_root () {
    switch (process.env.NODE_ENV) {
      case 'production':
        return 'https://api.psy-1.com'
      case 'test':
        return 'https://api.debug.psy-1.com'
    }
  }

  // WEB跳转基地址
  static get_web_root () {
    switch (process.env.NODE_ENV) {
      case 'production':
        return 'https://www.heartide.com'
      case 'test':
        return 'https://web.debug.psy-1.com'
    }
  }

  // 加入百度统计
  static baidu_statics () {
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?c6a0be7a2e98e04ca2cf523568e2cbc4'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  }

  static callAppRouter (method, params={}, callback) {
    try {
      let req = {
        'Method': method,
        'Data': params
      },cbName = `CB_${Date.now()}_${Math.ceil(Math.random() * 10)}`;
      req=JSON.stringify(req);
      Xinchao.Web[cbName] =  (err, result) => {
        if(callback){
          callback(err, result);
        }
        delete Xinchao.Web[cbName];
      };
      if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
        window.webkit.messageHandlers.XinchaoApp.postMessage({req, cbName});
      } else {
        XinchaoApp.callRouter(req, cbName);
      }
    } catch (e) {

    }
  }
}
