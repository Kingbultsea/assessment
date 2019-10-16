/* eslint-disable */
import axios from 'axios'
let URL = ''

export default class Share {
  constructor ({ url, title, desc, pic, dataUrl = null }) {
    console.log('??')
    URL = url
    this.url = url
    this.title = title
    this.desc = desc
    this.pic = pic
    this.dataUrl = dataUrl // 第一次启动的是appInit
  }

  appShare () {
    const share_data = {
      type1: {
        title: this.title,
        desc: this.desc,
        link: this.url,
        imgUrl: this.pic,
        shareType: 1
      },
      type2: {
        title: this.title,
        link: this.url,
        imgUrl: this.pic,
        shareType: 2
      },
      type3: {
        imgUrl: '', // 空出来 不然优先分享图片
        shareType: 3
      }
    }
    document.getElementById('share').value = JSON.stringify(share_data)
    document.getElementById('share2').value = JSON.stringify(share_data.type1)
    document.getElementById('share3').value = JSON.stringify(share_data.type2)
  }

  callAppRouter (method, params={}, callback) {
    let req = {
      'Method': method,
      'Data': params
    }, cbName = `CB_${Date.now()}_${Math.ceil(Math.random() * 10)}`
    req = JSON.stringify(req)
    Xinchao.Web[cbName] = (err, result) => {
      if (callback) {
        callback(err, result)
      }
      delete Xinchao.Web[cbName]
    }
    if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
      window.webkit.messageHandlers.XinchaoApp.postMessage({
        req,
        cbName
      })
    } else {
      XinchaoApp.callRouter(req, cbName)
    }
  }

  appGetName () {
    this.callAppRouter('isLogin', {}, (err, result) => {
      if (JSON.parse(result).msg === '已登录') {
        this.callAppRouter('Login', {}, (err, result) => {
          try {
            const r = JSON.parse(result)
            localStorage.setItem('name', r.data.name)
            localStorage.setItem('avatar', r.data.avatar)
            localStorage.setItem('openid', r.data.openid)
            // console.log(r, 'hkjhkhk')
            // console.log(r.data.name, 'fgjhfjhfj')
          } catch (e) {
            // console.log(result.data.avatar)
            localStorage.setItem('avatar', result.data.avatar)
            localStorage.setItem('name', result.data.name)
            localStorage.setItem('openid', result.data.openid)
            // console.log(result.data.name)
          }
        })
      }
    })
  }

  weiXinShare () {
    const that = this
    const message = {
      title: that.title,
      desc: that.desc,
      link: that.url,
      imgUrl: that.pic // +'?imageView&thumbnail=400x0&quality=75&tostatic=0'
    }
    if (this.dataUrl) {
      // message.type = 'music'
      // message.dataUrl = this.dataUrl
    }
    wx.ready(function (res) {
      wx.onMenuShareAppMessage(message)
      wx.onMenuShareQQ(message)
      wx.onMenuShareQZone(message)
      wx.onMenuShareTimeline(message)
      wx.error((res) => {
        // alert(res)
      })
    })
  }

  weiXinSDK (url, bl) {
    const getappid = new XMLHttpRequest()
    const that = this
    getappid.open('GET', url + '/web/v1/wechat/config?debug=1&url=' + encodeURIComponent(location.href.split('#')[0]))

    getappid.onreadystatechange = function () {
      if (getappid.readyState === 4 && getappid.status === 200) {
        // console.log('sdk ok', bl, bl && !localStorage.getItem('name'))
        let getSDK = JSON.parse(getappid.response)
        // console.log(getSDK.data.wechat_config)
        getSDK.data.wechat_config.debug = false

        // console.log('这里错误？')
        const appid = 'wx2dbf7017998b37cb' // process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'wx2dbf7017998b37cb' : 'wx632d4c99bd681cf3'

        // 正式服 appid wx2dbf7017998b37cb   测试服： wx632d4c99bd681cf3
        // console.log('bl 没有bl 吗？', bl, bl && !localStorage.getItem('name'))
        if (bl && !localStorage.getItem('name')) window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +  '&redirect_uri=' + encodeURI(location.href.split('#')[0]) +'&response_type=code&scope=snsapi_userinfo#wechart_redirect'
        if (!bl || localStorage.getItem('name')) {
          wx.config(getSDK.data.wechat_config)
          that.weiXinShare()
          that.weiXinGetName(url)
        }
      }
    }
    getappid.send()
  }

  weatherCode () {
    parseQuery(window.location.href).code
    const QRblock = /code=(.+?)&/
    localStorage.setItem('test', window.location.href)
    const code = parseQuery(window.location.href).code
    // console.log(code)
    code && localStorage.setItem('code', code)

    if (code) { return code } else {
      return false
    }
  }

  weiXinGetName (url) {
    return new Promise((resolve) => {
      if (!localStorage.getItem('name') || !localStorage.getItem('openid')) {
        // console.log(code + 'cd' + localStorage.getItem('code'))
        const code = localStorage.getItem('code').replace(/code=/, '').replace(/\&.+/, '')
        // console.log(code)
        // console.log('axios 错误吗')
        axios.get(url + '/web/v1/wechat/user', { params: { code } }).then((res) => { // weixinUserData type:   root.d.ts
          const data = res.data
          // console.log(data)
          if (data.hasOwnProperty('data')) {
            // console.log(data)
            // console.log('设置session')
            localStorage.setItem('avatar', data.data.headimgurl)
            localStorage.setItem('name', data.data.nickname)
            localStorage.setItem('openid', data.data.openid)
            localStorage.setItem('sex', data.data.sex)

            localStorage.setItem('city', data.data.city)
            localStorage.setItem('country', data.data.country)
            localStorage.setItem('province', data.data.province)

            resolve()
            // console.log(data.data.nickname)
          }
        })
      } else {
        resolve()
      }
    })
  }

  weiXinInit (url) {
    const code = this.weatherCode()
    code ? this.weiXinSDK(url, false) : this.weiXinSDK(url, true)
  }

  appInit () {
    this.appShare()
    this.appGetName()
  }

  rawWeiXinShare (url) {
    const getappid = new XMLHttpRequest()
    const that = this
    getappid.open('GET', url + '/web/v1/wechat/config?debug=1&url=' + encodeURIComponent(location.href.split('#')[0]))
    getappid.onreadystatechange = function () {
      if (getappid.readyState === 4 && getappid.status === 200) {
        console.log('sdk ok')
        let getSDK = JSON.parse(getappid.response)
        console.log(getSDK.data.wechat_config)
        getSDK.data.wechat_config.debug = false

        wx.config(getSDK.data.wechat_config)
        that.weiXinShare()
      }
    }
    getappid.send()
  }

  rawGetName () {
    /* if (!localStorage.getItem('name')) {
      console.log(code + 'asd你想要的' + localStorage.getItem('code'))
      const code = localStorage.getItem('code').replace(/code=/, '').replace(/\&.+/, '')

      $.get(url + '/web/v1/wechat/user', { code }, (data) => {
        console.log('jq都不行？'); console.log(data.data.nickname)
        localStorage.setItem('name', data.data.nickname)
      })
    } */
  }
}

function parseQuery(url) {
  let queryObj = {}
  let reg = /[?&]([^=&#]+)=([^&#]*)/g
  let querys = url.match(reg)
  if (querys) {
    for (let i in querys) {
      let query = querys[i].split('=')
      let key = query[0].substr(1)
      let value = query[1]
      queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
    }
  }
  return queryObj
}
