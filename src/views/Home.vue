<template>
  <div class="home animated fadeIn" v-show="initialReady">
    <div class="common-template">
      <img class="banner-pic" :src="homeData.bannerPic" />
      <div class="content">
        <p class="name">{{homeData.name}}</p>
        <p class="vice-name">{{homeData.viceName}}</p>
        <div class="price-div">
          <span class="price">{{isCosSleep ? '' : '￥'}}{{homeData.price}}<span :class="{'set-font-size-12': isCosSleep}"> {{isCosSleep ? '睡贝' : ''}}</span></span>
          <div class="origin-price">{{isCosSleep ? '' : '￥'}}{{homeData.originPrice}}{{isCosSleep ? '睡贝' : ''}}</div>
        </div>
        <div class="dirvide"></div> <!-- 分割线 -->
        <div class="count-template">
          <span>· {{homeData.questionCount}}道精选题</span>
          <span>· 7页分析报告</span>
          <span>· {{homeData.peopleTest}}人测过</span>
        </div>
      </div>
    </div>
    <span style="font-size: 8px;color:rgba(0, 0, 0 0.5)">{{$root.msg}}</span>

    <div class="introduce-template">
      <div class="title">内容简介</div>
      <div class="content-template fix-bootom-10" v-html="removeBrStr(parseHTMLToindector(homeData.contentValidity))"></div>
    </div>
    <div class="introduce-template">
      <div class="title">你将获得</div>
      <div class="content-template tag-content" v-html="homeData.yourHarvest">
      </div>
    </div>
    <div class="introduce-template">
      <div class="title">适合谁测</div>
      <div class="content-template tag-content2" v-html="padDiv(homeData.suitableForSpeculation)"></div>
    </div>
    <div class="introduce-template add-margin">
      <div class="title">理论背景</div>
      <div class="content-template" v-html="homeData.professionalTheory"></div>
      <div class="professional-parameters-title fix-btm">- 研发团队 -</div>
      <div class="content-template color-bg-content" style="text-align: justify" v-html="homeData.groups"></div>
      <img class="icon-pic" :src="homeData.groupsPic"/>
      <div class="professional-parameters-title">- 专业参数 -</div>
      <div class="professional-query add-margin-profession" v-html="homeData.notice"></div>
      <div class="professional-parameters-title fix-btm">- 部分参考文献 -</div>
      <div class="content-template color-bg-content" v-html="homeData.reference"></div>
    </div>

    <!-- <div class="dirvide-special">
      <div class="line"></div>
      <div class="circle"></div>
      <div class="line"></div>
    </div> -->

    <!-- <div class="professional-parameters">
      <div class="title">专业参数</div>
      <div class="content professional-query" v-html="homeData.notice">
      </div>
    </div> -->
    <div class="update-template animated fadeIn" v-if="needUpdate">
      <div class="update">
        <img class="update-img" src="../assets/cosleep_windows_img_upgrade@2x.png">
        <div class="content">
          <p class="title">小睡眠升级新版提示</p>
          <p>你正使用的小睡眠版本较低
            暂时不支持当前功能或活动
            请升级到小睡眠4.2.0及以上版本</p>
        </div>
        <div class="button" @click="toUpdate">立刻升级</div>
      </div>
    </div>

    <div class="fixed-bar">
      <img @click="toMyReport" class="icon" src="../assets/我的报告.png" />
      <div class="btn" @click="this.$root.payAPI">
        <!-- 立即购买 -->
        {{this.$root.haveUnDone ? '继续测评' : '立即购买'}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tool from '../unit/tool'
import wjhJS from '@/unit/wjhJS';

interface webchatpubpay {
  appId: string,
  timeStamp: number,
  nonceStr: string,
  package: string,
  signType: string,
  paySign: string
}

declare const WeixinJSBridge: any

const enum cv {
  id = 'id',
  name = 'title',
  viceName = 'subtitle',
  specie = 'category',
  coverPic = 'cover',
  bannerPic = 'banner',
  originPrice = 'price_origin',
  peopleTest = 'people_test',
  questionCount = 'question_num',
  price = 'price',
  theme = 'theme_color',
  contentValidity = 'intro',
  yourHarvest = 'reward',
  professionalTheory = 'theory',
  suitableForSpeculation = 'suitable',
  notice = 'notice',
  reference = 'references',
  groups = 'rd_team',
  groupsPic = 'rd_team_icon'
}

@Component({
  components: {
  }
})
export default class Home extends Vue {
  private isCosSleep: boolean = Tool.is_cosleep()
  private styleList: any = {
    默认: 1,
    橙色感性主题: 2
  }
  private initialReady: boolean = false // 初始化
  private homeData: homeData = {
    id: 1,
    bannerPic: '',
    name: '',
    viceName: '',
    price: 0,
    originPrice: 0,
    questionCount: 0,
    peopleTest: '',
    contentValidity: '',
    yourHarvest: '',
    suitableForSpeculation: '',
    professionalTheory: '',
    notice: '',
    groups: '',
    groupsPic: ''
  }

  // 是否需要进行升级
  private needUpdate: boolean = false

  private busyPay: boolean = false

  private removeBrStr(content: string): string {
    if (content) {
      content = content.replace('<br>', '')
    }
    return content
  }

  // 内容传进来有可能首个div会不被纳进来，需要添加
  private padDiv(content: string): string {
    // console.log(content)
    const haveDiv = content.startsWith('div')
    if (!haveDiv) {
      const replaceStr = /(.*?)<div>/.exec(content)
      if (replaceStr && replaceStr instanceof Array && replaceStr.length >= 2) {
        // console.log(
        //         content.replace(replaceStr[1] as string, '<div>' + replaceStr[1] + '</div>'),
        //         replaceStr
        // )
        return content.replace(replaceStr[1] as string, '<div>' + replaceStr[1] + '</div>')
      }

      // 纯文字 单句
      if (!content.includes('div')) {
        return '<div>' + content + '</div>'
      }
    }
    return content
  }

  // 查看当前版本是否为最新版本
  private checkNeedUpdate(cb = () => {}) {
    if (!this.Tool.is_cosleep()) {
      return
    }
    this.Tool.callAppRouter('getEnv', {}, (res: any, ed: any) => {
      if (this.Tool.is_cosleep_ios()) {
        // ios 端
        ed = JSON.parse(ed)
        if (ed.data.version < 252) {
          this.needUpdate = true
        }
        return
      }
      // console.log(ed)
      if (ed.data.version < 85) {
        this.needUpdate = true
      }
    })
  }

  // 去更新最新版本
  private toUpdate() {
    this.Tool.callAppRouter('updateApp')
  }

  // 换行功能
  public parseLineFeed(text: string, times: number): string {
    return text.replace(/script/g, '').replace(/\n/g, '<br/>'.repeat(times))
  }

  // 转换成tag-content
  public parseLineToTagDiv(text: string): string {
    text = text.replace(/script/g, '')
    return text.split('\n').map((v: string) => `<div class="tag-content">${v}</div>`).join('')
  }

  // 换成拥有背景颜色的content模板
  public parseToColorBgContent(text: string, times: number): string {
    text = this.parseLineFeed(text, times)
    return text.replace(/\${(.+)}/, `<div class="color-bg-content">$1</div>`)
  }

  // 跳转到正确的style_id
  private link2Style(serveName: string) {
    // console.log(serveName)
    const styleId = this.$wjh.parseQuery(window.location.href) as any
    if (serveName === '默认' || serveName === '蓝色理性主题') {
      if (styleId.style_id) {
        window.location.replace(this.$wjh.funcUrlDel('style_id'))
        return
      }
    }

    if (serveName === '橙色感性主题') {
      if (parseInt(styleId.style_id) !== 2) {
        window.location.replace(
                this.$wjh.changeUrlArg(window.location.href.split('#')[0], 'style_id', '2')
        )
        return
      }
    }

    document.title = this.homeData.name

    this.$root.loading = false
    this.initialReady = true // 初始化渲染成功

    // 可以进行授权询问了
    if (!this.$root.isCosSeep && !this.$root.token) {
      process.env.NODE_ENV === 'production'
              ? this.$root.getCodeWeChat()
              : ''
    }
  }

  // 获取服务器信息
  private getData() {
    this.$axios.get('/api/assessments/find', { params: { id: this.$root.id } }).then((res: any) => {
      if (res.data.status === 0) {
        const data = res.data.data as any

        /* 枚举实在无法使用....
        for (const i in this.homeData) {
          if (i) {
            this.homeData[i] = data[cv[i]]
          }
        } */
        this.homeData.name = data[cv.name]
        this.link2Style(data.theme_color)

        this.homeData.id = data[cv.id]
        this.homeData.viceName = data[cv.viceName]
        this.homeData.specie = data[cv.specie]
        this.homeData.coverPic = data[cv.coverPic]
        this.homeData.bannerPic = data[cv.bannerPic]
        this.homeData.originPrice = data[cv.originPrice]
        this.homeData.peopleTest = data[cv.peopleTest]
        this.homeData.questionCount = data[cv.questionCount]
        this.homeData.price = data[cv.price]
        this.homeData.theme = data[cv.theme]
        this.homeData.contentValidity = data[cv.contentValidity]
        this.homeData.yourHarvest = data[cv.yourHarvest]
        this.homeData.professionalTheory = data[cv.professionalTheory]
        this.homeData.suitableForSpeculation = data[cv.suitableForSpeculation]
        this.homeData.notice = data[cv.notice]
        this.homeData.reference = data[cv.reference]
        this.homeData.groups = data[cv.groups]
        this.homeData.groupsPic = data[cv.groupsPic]

        this.$root.haveUnDone = data.undone

        sessionStorage.setItem('title', '' + this.homeData.name)
        sessionStorage.setItem('price', '' + this.homeData.price)
        sessionStorage.setItem('originPrice', '' + this.homeData.originPrice)

        // document.title = this.homeData.name
        // 在连接跳转总做判断 免得闪烁
        this.$root.bannerPic = this.homeData.bannerPic
        // this.$root.loading = false

        this.$root.shareM(this.homeData.name, this.homeData.viceName, this.homeData.coverPic || 'https://res.psy-1.com/Fp1Izu3J4WNYC3kJaFd5hAOQCKb5')
      }
    })
  }

  // 公众号相关支付信息
  private wechatPublicPayWayData(wechatpubpay: webchatpubpay) {
    const getBrandWCPayRequest = wechatpubpay
    // console.log('pay 平台')
    WeixinJSBridge.invoke(
            'getBrandWCPayRequest', getBrandWCPayRequest,
            (res: any) => {
              // console.log(res)
              if (res.err_msg === 'get_brand_wcpay_request:ok' ) {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                this.$router.push('/cw')
              }
            })
  }

  // 支付接口
  private async payAPI() {
    if (this.busyPay) {
      return
    }
    this.busyPay = true
    if (!this.$root.token) {
      // await this.$root.share.wei
      await this.$root.login()
    }

    if (!this.$root.token) {
      // 用户没有登录 进入授权页面
      if (!localStorage.getItem('openid') || localStorage.getItem('openid') === 'null') {
        this.$router.push('/lp')
      }
      return
    }

    if (this.$root.haveUnDone) {
      this.$root.loadingText = '数据加载中…'
    } else {
      this.$root.loadingText = '支付信息获取中 请稍候…'
    }

    this.$root.loading = true
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
        this.$root.loading = false
        return
      }

      // 已经购买 但是还没有完成的测评
      if (res.data.status === 10005) {
        // 用户是否有未完成的数据
        this.$root.haveUnDone = true
        this.$router.push('/cw')
        this.$root.loading = false
        return
      }

      // 用户没有登录 进入授权页面
      // if (!localStorage.getItem('openid')) {
      //   this.$router.push('/lp')
      // }
    }).catch(() => {
      // 用户没有登录 进入授权页面
      if (!localStorage.getItem('openid')) {
        this.$router.push('/lp')
      }
    })
  }

  // 渲染成 灰色 带 ·的样式
  private parseHTMLToindector(data: string) {
    if (data) {
      data = data.replace(/\n/g, '')
      // console.log(data, '查看原型是怎么样子的')
      data = data.replace(/<div>(\})<\/div>/, '$1')
      data = data.replace(/<div>(\^\{)<\/div>/, '$1')
      // console.log(data, '查看replace 修复过来的str')
      return data.replace(/\^\{(.*?)\}/g, (a: string, b: any): string => {
        // console.log(b, '123')
        // console.log(a, '456')
        return `<div class="fix-green-color">${b}</div>`
      })
    }
  }

  // 我的报告按钮
  private async toMyReport() {
    if (this.$root.isCosSeep) {
      const loginStatus = await this.$root.checkUserLoginStatus()
      if (!loginStatus) {
        await this.login()
      } else {
        this.$router.push('/mp')
      }
      return
    }
    // if (this.$root.haveUnDone) {
    //   this.$router.push('/cw')
    // } else {
    //   this.$router.push('/mp')
    // }
    this.$router.push('/mp')
  }

  private async created() {
    this.checkNeedUpdate()
    localStorage.removeItem('loadingtext')
    this.$root.canScroll = false
    if (this.$root.scrollFun) {
      window.document.removeEventListener('scroll', this.$root.scrollFun)
    }
    this.$root.loading = true
    window.scrollTo(0, 0)

    if (!this.$root.token && (localStorage.getItem('openid') === 'null'
            || localStorage.getItem('openid')
            ) && !this.$root.isCosSeep) {
      // console.log('Home 调用登录')
      await this.$root.login()
    }
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
  @import "Home.scss";
</style>

<style lang="scss">
  .set-font-size-12 {
    font-size: px2html(12px) !important;
  }
  .update-template {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 99;
    left: 0px;
    top: 0px;
    @include flexCenter;
    background: rgba(0, 0, 0, 0.5);
    .update {
      overflow: hidden;
      border-radius: px2html(10px);
      display: flex;
      flex-direction: column;
      width: px2html(290px);
      background: #fff;
      color: #000;
      align-items: center;
      .update-img {
        width: 100%;
      }
      .content {
        padding: px2html(10px) px2html(20px);
        font-size: px2html(10px);
        .title {
          font-size: px2html(18px);
          font-weight: 700;
          margin-bottom: px2html(20px);
        }
      }
      .button {
        width: px2html(100px);
        height: px2html(30px);
        font-size: px2html(12px);
        color: #fff;
        border-radius: px2html(20px);
        @include flexCenter;
        background: #4B90E0;
        margin-top: px2html(10px);
        margin-bottom: px2html(20px);
      }
    }
  }
  .professional-query {
    color: #999999;
    margin-top: px2html(20px);
    font-size: px2html(12px);
    border-left: px2html(1px) solid #E6E6E6;
    border-right: px2html(1px) solid #E6E6E6;
  }
  .add-margin-profession {
    margin-bottom: px2html(30px);
  }
  .professional-query div {
    text-indent: px2html(10px);
    width: 100%;
    position: relative;
    border-top: px2html(1px) solid #E6E6E6;
    b {
      text-indent: px2html(0px);
      padding-top: px2html(5px);
      padding-bottom: px2html(5px);
      margin-right: px2html(10px);
      border-right: px2html(1px) solid #E6E6E6;
      display: inline-block;
      width: 50%;
    }
  }
  .professional-query div:last-of-type {
    border-bottom: px2html(1px) solid #E6E6E6;
  }
  .tag-content div {
    position: relative;
    width: px2html(274px);
    margin-left: px2html(20px);
    margin-bottom: px2html(10px);
  }
  .tag-content div:last-of-type {
    margin-bottom: px2html(0px);
  }
  .tag-content div::before {
    position: absolute;
    left: px2html(-4px);
    top: px2html(2px);
    content: '';
    transform: translateX(-100%);
    width: px2html(10px);
    height: px2html(14px);
    background: url("../assets/resultIconList/1@3x.png");
    background-repeat: no-repeat;
    background-size: auto 100%;
  }

  .tag-content2 div {
    position: relative;
    width: px2html(274px);
    margin-left: px2html(20px);
    margin-bottom: px2html(10px);
  }
  .tag-content2 div:last-of-type {
    margin-bottom: px2html(0px);
  }
  .tag-content2 div::before {
    position: absolute;
    left: px2html(-6px);
    top: px2html(1px);
    content: '';
    transform: translateX(-100%);
    width: px2html(14px);
    height: px2html(18px);
    background: url("../assets/resultIconList/7@3x.png");
    background-repeat: no-repeat;
    background-size: auto 100%;
  }


  .color-bg-content {
    div div {
      margin-bottom: px2html(14px);
    }
    margin-top: 0px!important;
    color: #999999;
    // border-top: px2html(1px) solid rgba(153, 153, 153, 0.22);
    // padding-top: px2html(24px);
    // margin-top: px2html(24px);
    // background: #FAFAFA;
    box-sizing: border-box;
    text-align: left;
    // padding: px2html(20px) px2html(16px);
  }

  // 修改section 为粘连 状态
  .fix-rest-section {
    margin-top: px2html(20px);
    div div {
      margin-top: px2html(10px) !important; // 有坑 因为 后台传入的 第一个不是div 后面的才带div
    }
  }

  .fix-green-color {
    margin: 0px!important;
    color: #999999 !important;
    div {
      margin: 0px!important;
    }
  }
</style>
