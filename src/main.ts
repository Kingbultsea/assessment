import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import wjh from './unit/wjhJS.js'
import animated from 'animate.css'
import Share from './unit/shareAndGetName.js'

require('@/unit/setSize')
const md5 = require('blueimp-md5')

const URL = process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'https://wenjuan.common.heartide.com/' : 'https://debug.wenjuan.common.heartide.com/' // http://heartide.free.idcfengye.com https://debug.wenjuan.common.heartide.com/
const URLSHARE = 'https://api.psy-1.com' // process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'https://api.psy-1.com' : 'https://api.debug.psy-1.com'

// 版本号
const VERSION = 1

const myAxios = Axios.create({
  baseURL: URL,
  headers: {
    version: VERSION
  }
})

// const QUERY = wjh.parseQuery(document.location.href) as any

const AXIOSFULLFILLFUNCTION = (config: any) => {
  const data = config.data
  let params = '' as string
  const key = 'HeartideAssessment' as string
  for (const i in data) {
    if (data[i] !== '') {
      params += i + '=' + data[i] + '&'
    }
  }
  params = params.replace(/\&$/, '')
  // console.log(params)
  const str = `version=${VERSION}&${key}&${params}&${key}`
  // console.log(md5(str).toUpperCase(), str)
  config.sign = md5(str).toUpperCase()
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

Vue.config.productionTip = false
Vue.use(animated)

new Vue({
  data() {
    return {
      loading: false as boolean,
      busyPay: false,
      haveUnDone: false as boolean,
      URLSHARE: URLSHARE,
      openid: localStorage.getItem('openid'), // || '1234-s3qIvA1_qcA-r6fYH7zF50k',
      id: 43 as number,
      token: '' as string,
      channel: 1, // 支付参数也是这个
      platForm: 2, // ios: 1  android: 2
      rpData: '' as any, // 做完题 传递给 结果页
      bannerPic: '' as any, // 做完题 传递给结果页的 bannerPic
      share: '' as any
    }
  },
  methods: {
    parseQuery(url: string) {
    let queryObj = {} as any
    let reg = /[?&]([^=&#]+)=([^&#]*)/g
    let querys = url.match(reg)
    if (querys) {
      for (let i in querys) {
        let query = querys[i].split('=')
        let key = query[0].substr(1)
        let value = query[1] as any
        queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
      }
    }
      return queryObj
    },
    async shareM(title = '小睡眠', desc = '', picUrl: string) {
      const share = new Share({ pic: picUrl, url: window.location.href.split('#')[0], title: title, desc: desc })
      // share.appShare()
      share.rawWeiXinShare(URLSHARE)
      this.share = share
      if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
        share.weiXinInit(URLSHARE)
        share.weatherCode()
        await share.weiXinGetName(URLSHARE)
        this.openid = localStorage.getItem('openid')
      }
    },
    async login() {
      const headers = {
        openid: this.openid,
        channel: this.channel, // wechat: 1
        package: 2 // ios: 1  android: 2
      }

      const data = {
        nickname: localStorage.getItem('name') || '',
        avatarurl: localStorage.getItem('avatar') || '',
        sex: parseInt(localStorage.getItem('sex') as string) || 0,
        country: localStorage.getItem('country') || '',
        province: localStorage.getItem('province') || '',
        city: localStorage.getItem('city') || ''
      } as apiUSERSDATA

      return this.$axios.post('/api/users/login', data, { headers }).then((res: any) => {
        if (res.data.status === 0) {
          this.token = res.data.data.token

          // 设置全局header
          Vue.prototype.$axios = Axios.create({
            baseURL: URL,
            headers: {
              channel: this.channel,
              package: this.platForm,
              token: res.data.data.token,
              version: VERSION
            }
          })

          Vue.prototype.$axios.interceptors.request.use(AXIOSFULLFILLFUNCTION, (error: any) => {
            return Promise.reject(error)
          })

          return res.data.data.token
        }
      })
    },
    async payAPI() {
      if (this.busyPay) {
        return
      }
      this.busyPay = true
      if (!this.$root.token) {
        // await this.$root.share.wei
        await this.$root.login()
      }
      const data = {
        goods_id: this.$root.id,
        goods_vendor_ids: '[' + this.$root.channel + ']',
        wap_url: window.location.href.split('#')[0] + '#/cw'
      }
      this.$axios.post('/api/pay/order', data).then((res: any) => {
        if (res.data.status === 0) {
          this.busyPay = false
          let query = ''
          if (this.$root.channel === 1) { // 1 是微信
            query = 'wechatpubpay'
            this.wechatPublicPayWayData(res.data.data.pay_platforms[query] as webchatpubpay)
          }
        }

        // 已经购买 但是还没有完成的测评
        if (res.data.status === 10005) {
          // 用户是否有未完成的数据
          this.$root.haveUnDone = true
          this.$router.push('/cw')
        }
      })
    },
    wechatPublicPayWayData(wechatpubpay: webchatpubpay) {
      const getBrandWCPayRequest = wechatpubpay
      console.log('pay 平台')
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', getBrandWCPayRequest,
          (res: any) => {
            console.log(res)
            if (res.err_msg === "get_brand_wcpay_request:ok" ) {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              this.$router.push('/cw')
            }
          })
    }
  },
  created() {
    this.id = this.parseQuery(window.location.href).id || 107
    this.shareM('小睡眠', '小睡眠', 'https://wx2.sinaimg.cn/mw690/006Zdy2vgy1frycovbf8cj304z0553zu.jpg')
  },
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
