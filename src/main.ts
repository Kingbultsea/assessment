import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import wjh from './unit/wjhJS.js'
import animated from 'animate.css'
import Share from './unit/shareAndGetName.js'

require('@/unit/setSize')

const URL = process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'https://wenjuan.common.heartide.com/' : 'https://debug.wenjuan.common.heartide.com/'
const URLSHARE = 'https://api.psy-1.com' // process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? 'https://api.psy-1.com' : 'https://api.debug.psy-1.com'


const myAxios = Axios.create({
  baseURL: URL
})

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
        nickname: '蔡徐坤',
        avatarurl: 'https://wx2.sinaimg.cn/mw690/006Zdy2vgy1frycovbf8cj304z0553zu.jpg',
        sex: 0,
        country: '中国',
        province: '湖南',
        city: '湖南市'
      }

      return this.$axios.post('/api/users/login', data, { headers }).then((res: any) => {
        if (res.data.status === 0) {
          this.token = res.data.data.token

          // 设置全局header
          Vue.prototype.$axios = Axios.create({
            baseURL: URL,
            headers: {
              channel: this.channel,
              package: this.platForm,
              token: res.data.data.token
            }
          })

          return res.data.data.token
        }
      })
    }
  },
  created() {
    console.log('created')
    this.id = this.parseQuery(window.location.href).id
    this.shareM('小睡眠', '小睡眠', 'https://wx2.sinaimg.cn/mw690/006Zdy2vgy1frycovbf8cj304z0553zu.jpg')
  },
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
