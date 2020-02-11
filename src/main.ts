import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import wjh from './unit/wjhJS.js'
import animated from 'animate.css'
import Share from './unit/shareAndGetName.js'
import wjhJS from './unit/wjhJS'
import Tool from './unit/tool'

if (process.env.NODE_ENV !== 'production') {
  require('../public/vconsole.min.js')
}

require('@/unit/setSize')
const md5 = require('blueimp-md5')

const EVN = process.env.VUE_APP_TITLE

const URL = process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'https://wenjuan.common.heartide.com/' : 'https://debug.wenjuan.common.heartide.com/' // http://heartide.free.idcfengye.com https://debug.wenjuan.common.heartide.com/
const URLSHARE = 'https://api.psy-1.com'
// process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment'
// ? 'https://api.psy-1.com'
// : 'https://api.debug.psy-1.com'

// 版本号
const VERSION = 2

const myAxios = Axios.create({
  baseURL: URL,
  headers: {
    version: VERSION
  }
})

const AXIOSFULLFILLFUNCTION = (config: any) => {
  let data = config.data || config.params || {}

  // post 对data 进行acsii码 进行排序
  if (config.method === 'post') {
    data = wjhJS.sort_ASCII(data)
  }

  let params = '' as string
  const key = 'fe4cd0c961d9e394ddf370aa3033da33+5db1796320e71' as string
  const groupsData = [] as any
  for (const i in data) {
    if (data[i] !== '') {
      groupsData.push([i, data[i]])
      // params += i + '=' + data[i] + '&'
    }
  }
  groupsData.reverse()
  groupsData.forEach((v: any) => {
    params += v[0] + '=' + v[1] + '&'
  })
  params = params.replace(/\&$/, '')
  const version = md5(`version=${VERSION}${key}`).split('').splice(9, 16).join('')
  params = md5(params).split('').splice(8, 16).join('')
  const str = (version + '+' + key + '+' + params)
  config.headers.sign = md5(md5(str).toUpperCase().split('').splice(10, 16).join(''))

  return config
}

myAxios.interceptors.request.use(AXIOSFULLFILLFUNCTION, (error) => {
  return Promise.reject(error)
})

interface webchatpubpay {
  appId: string,
  timeStamp: number,
  nonceStr: string,
  package: string,
  signType: string,
  paySign: string
}

declare const WeixinJSBridge: any

declare module 'vue/types/vue' { // 模块补充 可以去这个路径查阅
  interface Vue {
    $wjh: any,
    [key: string]: any, // 解决对象的遍历
    $axios: any
  }
}

Vue.prototype.$wjh = wjh
Vue.prototype.$axios = myAxios
Vue.prototype.Tool = Tool

Vue.config.productionTip = false
Vue.use(animated)

new Vue({
  data() {
    return {
      msg: '',
      timeOutMaker: '' as any,
      haveBuy: false, // 是否已经购买
      isCosSeep: Tool.is_cosleep(),
      usersData: {
          avatarurl: '',
          nickname: '',
          sex: '',
          token: ''
      },
      canScroll: false as boolean,
      scrollFunc: '' as any, // 删除事件 scroll
      loading: false as boolean,
      busyPay: false,
      haveUnDone: false as boolean,
      URLSHARE,
      openid: localStorage.getItem('openid'), // || '1234-s3qIvA1_qcA-r6fYH7zF50k',
      id: 43 as number,
      token: localStorage.getItem('token'), // process.env.NODE_ENV === 'production' ? localStorage.getItem('token') : '2aed3eb2b031c350250a468d5f6b1706', // || '2aed3eb2b031c350250a468d5f6b1706',
      channel: 1, // 支付参数也是这个
      platForm: (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) ? 2 : 1, // ios: 1  android: 2
      rpData: '' as any, // 做完题 传递给 结果页
      bannerPic: '' as any, // 做完题 传递给结果页的 bannerPic
      share: new Share({ pic: 'picUrl', url: window.location.href.split('#')[0], title: 'title', desc: 'desc' }) as any,
      loadingText: '数据加载中…' as string // loading 的文案
    }
  },
  methods: {
    debugLogger(content: any) {
      if (localStorage.getItem('openid') === '02423fa90222ff4f1218a6ee033f72f3' || this.openid === '02423fa90222ff4f1218a6ee033f72f3') {
        const logger = {
          msgtype: 'text',
          text: {
            content: content
          }
        }
        this.$axios.post('/api/resource/logger/proxy', { logger: JSON.stringify(logger) }).then((res: any) => {})
      }
    },
    parseQuery(url: string) {
      const queryObj = {} as any
      const reg = /[?&]([^=&#]+)=([^&#]*)/g
      const querys = url.match(reg)
      if (querys) {
        for (const i in querys) {
          if (i || +i === 0) {
            const query = querys[i].split('=')
            const key = query[0].substr(1)
            const value = query[1] as any
            queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
          }
        }
      }
      return queryObj
    },
    async shareM(title = '小睡眠', desc = '', picUrl: string) {
      const share = new Share({ pic: picUrl, url: window.location.href.split('#')[0], title, desc })
      // share.appShare()
      share.rawWeiXinShare(URLSHARE)
      // this.share = share
      // if (!localStorage.getItem('openid') && localStorage.getItem('openid') !== 'null' &&
      // /micromessenger/.test(navigator.userAgent.toLowerCase())) {
      //   share.weiXinInit(URLSHARE)
      //   share.weatherCode()
      //   // await share.weiXinGetName(URLSHARE)
      //   this.openid = localStorage.getItem('openid')
      //   if (true) {
      //     this.login()
      //   }
      // }
    },
    // 微信那边获取code
    async getCodeWeChat(init = true as boolean) {
      if (process.env.VUE_APP_TITLE === 'experiment' && !/micromessenger/.test(navigator.userAgent.toLowerCase())) {
        return
      }
      // console.log('code ~~22334')
      if (true) { // /micromessenger/.test(navigator.userAgent.toLowerCase())
        this.share.weiXinInit(URLSHARE)
        // this.share.weatherCode()
        // await share.weiXinGetName(URLSHARE)
        // this.openid = localStorage.getItem('openid')
        this.login() // 没有Token才需要去登录
      }
    },
    // 设置axios
    setAxios() {
      // 设置全局header
      let headers = {
        channel: this.channel,
        package: this.platForm,
        token: this.token,
        version: VERSION
      } as any

      if (this.openid) {
        headers.openid = this.openid
      }

      this.debugLogger(`配置全局header: ${JSON.stringify(headers)}`)

      Vue.prototype.$axios = Axios.create({
        baseURL: URL,
        headers
      })

      Vue.prototype.$axios.defaults.retry = 4
      Vue.prototype.$axios.defaults.retryDelay = 2000
      Vue.prototype.$axios.interceptors.response.use((res: any) => {
        const status = res.data.status as number
        if (status !== 0 && status !== 10005) { // 非成功 需要loading出现文案
          this.loadingText = res.data.msg
        }
        switch (true) {
          case status === 10003: // 未登录，是token的错误
              this.$router.push('/lp')
              localStorage.clear()
              this.$root.loading = false
        }
        return res
      })
      Vue.prototype.$axios.interceptors.request.use(AXIOSFULLFILLFUNCTION, (error: any) => {
        const config = error.config
        if (!config || !config.retry) {
          return Promise.reject(error)
        }
        config.__retryCount = config.__retryCount || 0
        if (config.__retryCount >= config.retry) {
          return Promise.reject(error)
        }
        config.__retryCount += 1
        const backOff = new Promise((resolve) => {
          setTimeout(() => {
            resolve()
            this.loadingText = '网络连接失败,请检查您的网络后再试'
          }, config.retryDelay || 1)
        })
      })
    },
    // 处理登录的未知错误
    async loginApi(headers: any, data: any, func: () => {}) {
      this.$axios.post('/api/users/login', data, { headers }).then(async (res: any) => {
        if (res.data.status === 0) {
          // console.log(res)
          // this.token = true
          let reReload = false
          const beforeToken = localStorage.getItem('token')

          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('avatar', res.data.data.avatarurl)
          localStorage.setItem('name', res.data.data.nickname)

          this.token = res.data.data.token
          this.usersData = res.data.data

          // 配置axios
          this.setAxios()

          if (beforeToken !== this.token) {
            // 有新的token的话 需要重新拉取home.vue的获取信息 因为需要知道是否继续测评
            // async 的ts 结构要熟悉下
            const UNDONE: boolean = (await this.checkAssessmentsVerify()) as any
            this.haveUnDone = UNDONE
          }

          this.debugLogger(`调用/api/users/login\r\n, 重新配置全局header, 请求/api/users/assessments/verify, 用户是否未完成问卷：${this.haveUnDone}`)

          return res.data.data.token
        }

        // 微信code无效 或者已经被使用的情况
        if (res.data.status === 10018 || res.data.status === 10017) {
          func()
          // this.$router.push('/lp')
          return
        }
      }).catch(() => {
        return null
      })
    },
    // 获取用户对指定测评的状态值
    async checkAssessmentsVerify() {
      return this.$axios.get('/api/users/assessments/verify', { params: { id: this.id } }).then((res: any) => {
        if (res.data.status === 0) {
          return res.data.data.undone
        }
      }).finally(() => false)
    },
    // 检查token是否有效
    async checkTokenValid() {
      return this.$axios.get('/api/users/verify/token').then((res: any) => {
        if (res.data.status === 0) {
          return true
        } else {
          return false
        }
      }).finally(() => {
        return false
      })
    },
    // 小睡眠登录
    async coSeepLogin() {
      const headers = {
        openid: '', // cosleep的openid
        channel: this.channel, // wechat: 1 cosleep: 2
        package: this.platForm // ios: 1  android: 2
      }

      let data = {
      }

      let needLogin = true
      let noReload = false

      this.$root.loading = false
      this.busyPay = false

      await new Promise((resolve) => {
        Tool.callAppRouter('Login', {}, async (res: any, ed: any) => {
          let mesg = null
          if (typeof ed === 'string') {
            mesg = JSON.parse(ed)
          } else {
            mesg = ed
          }

          this.msg = JSON.stringify(ed) + ' - ' + localStorage.getItem('openid') + ' - ' + mesg

          if (localStorage.getItem('openid') !== mesg.data.openid) {
            noReload = true
            localStorage.clear()
            localStorage.setItem('openid', mesg.data.openid as string)
            window.location.reload()
            return
          }

          const checkValid = await this.checkTokenValid()

          this.debugLogger(`token是否有效: ${checkValid}`)

          console.log(
              checkValid, '不需要login阿'
          )

          if (localStorage.getItem('openid') === mesg.data.openid && localStorage.getItem('token') && checkValid) {
            this.debugLogger(`token有效且重新获取的openid和本地缓存的一致且缓存中有token，无需登录，复用token`)
            needLogin = false
            return
          }

          this.debugLogger(`token无效且重新获取的openid和本地缓存的不一致，需要重新登录`)

          this.openid = mesg.data.openid

          localStorage.setItem('openid', this.openid as string)
          headers.openid = mesg.data.openid

          data = {
            sex: mesg.data.sex,
            nickname: mesg.data.name,
            avatarUrl: mesg.data.avatar
          }

          resolve()
        })
      })

      if (needLogin) {
        return this.loginApi(headers, data, (): any => {
          if (!noReload) {
            localStorage.clear()
          }
          window.location.reload()
        })
      }
    },
    // 微信登录
    async wechatLogin() {
      const headers = {
        // openid: this.openid,
        channel: this.channel, // wechat: 1
        package: this.platForm // ios: 1  android: 2
      }

      // const data = {
      //   nickname: localStorage.getItem('name') || '',
      //   avatarurl: localStorage.getItem('avatar') || '',
      //   sex: parseInt(localStorage.getItem('sex') as string) || 0,
      //   country: localStorage.getItem('country') || '',
      //   province: localStorage.getItem('province') || '',
      //   city: localStorage.getItem('city') || ''
      // } as apiUSERSDATA
      const CODE = this.parseQuery(window.document.location.href).code || localStorage.getItem('code')
      const data = {
        code: CODE
      }
      return this.loginApi(headers, data, (): any => {
        localStorage.clear()
        window.location.href = this.$wjh.funcUrlDel('code') + '#/lp'
      })
    },
    async login() {
      switch (this.channel) {
        case 1:
          this.wechatLogin()
          break
        case 2:
          await this.coSeepLogin()
          break
      }
    },
    async checkUserLoginStatus(needLogin: boolean = true) {
      return new Promise((resolve) => {
        Tool.callAppRouter('isLogin', {}, async (res: any, ed: any) => {
          let mesg = null
          if (typeof ed === 'string') {
            mesg = JSON.parse(ed)
          } else {
            mesg = ed
          }
          if (mesg.msg === '已登录') {
            resolve(true)
          } else {
            if (needLogin) {
              this.$root.loading = true
              await this.login()
            }
            resolve(false)
          }
        })
      })
    },
    async payAPI() {
      if (this.busyPay) {
        return
      }
      if (this.haveUnDone) {
        this.loadingText = '数据加载中…'
      } else {
        this.loadingText = '支付信息获取中 请稍候…'
      }
      this.$root.loading = true
      this.busyPay = true

      if (this.$root.channel === 2) { // 调用睡呗支付 cosleep端
        const logiinStatus = await this.checkUserLoginStatus()
        if (!logiinStatus) {
          this.busyPay = false
          this.$root.loading = false
          // 没有登录 或登录失效
          return
        }
        if (this.haveUnDone) {
          this.$router.push('/cw')
          this.busyPay = false
          return
        }

        if (this.timeOutMaker) {
          clearTimeout(this.timeOutMaker)
        }

        this.timeOutMaker = setTimeout(() => {
          if (this.busyPay === true) {
            // this.loadingText = '支付超时'
            setTimeout(() => {
              this.loading = false
              this.busyPay = false
            }, 2000)
          }
        }, 14000)
        // console.log('睡呗支付调用', res.data.data)
        Tool.callAppRouter('paymentCall', { func_id: this.id, func_type: 32 }, (res: any, ed: any) => {
          this.busyPay = false

          ed = JSON.parse(ed)
          if (ed.status === 1) {
            this.$router.push('/cw')
          }
          if (ed.status === 2) {
            this.loadingText = '支付失败'
            setTimeout(() => {
              this.loading = false
            }, 2000)
          }
        })
        return
      }

      const data = {
        goods_id: this.$root.id,
        goods_vendor_ids: '[' + this.$root.channel + ']',
        wap_url: window.location.href.split('#')[0] + '#/cw'
      }

      this.$axios.post('/api/pay/order', data).then((res: any) => {
        this.busyPay = false
        localStorage.removeItem('loadingtext')
        if (res.data.status === 0) {
          this.$root.loading = false
          let query = ''
          if (this.$root.channel === 1) { // 1 是微信
            query = 'wechatpubpay'
            this.wechatPublicPayWayData(res.data.data.pay_platforms[query] as webchatpubpay)
            return
          }
        }

        // 已经购买 但是还没有完成的测评
        if (res.data.status === 10005) {
          this.$root.loading = false
          // 用户是否有未完成的数据
          this.$root.haveUnDone = true
          this.$router.push('/cw')
          return
        }

        if (res.data.status === 10003) {
          this.$router.push('/lp')
          localStorage.clear()
          this.$root.loading = false
        }

        // 用户没有登录 进入授权页面
        // if (!localStorage.getItem('openid')) {
        //   this.$router.push('/lp')
        // }
      })
    },
    wechatPublicPayWayData(wechatpubpay: webchatpubpay) {
      const getBrandWCPayRequest = wechatpubpay
      // console.log('pay 平台')
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', getBrandWCPayRequest,
          (res: any) => {
            // console.log(res)
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              this.$router.push('/cw')
            }
          })
    }
  },
  mounted() {
    console.log(
        this.$refs
    )
  },
  async created() {
    this.id = this.parseQuery(window.location.href).id || 107

    if (this.isCosSeep) {
      this.debugLogger('小睡眠app端')
      this.channel = 2
      if (this.token) {
        this.debugLogger(`拥有token：${this.token}\r\n`)
        // 配置全局axios
        this.setAxios()
      }
      const loginStatus = await this.checkUserLoginStatus(false)
      if (loginStatus) {
        this.login()
      }
      return
      // this.login()
    }

    // 如果有token的情况下
    if (this.token) {
      // 配置全局axios
      this.setAxios()
    } else { // 没有token 需要去获取code 然后再去获取token 测试的时候这里可以去除 可以方便查看ui
      // this.getCodeWeChat() // 微信获取code
    }
  },
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
