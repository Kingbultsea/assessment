<template>
  <div class="home animated fadeIn">
    <div class="common-template">
      <img class="banner-pic" :src="homeData.bannerPic" />
      <div class="content">
        <p class="name">{{homeData.name}}</p>
        <p class="vice-name">{{homeData.viceName}}</p>
        <div class="price-div">
          <span class="price">￥{{homeData.price}}</span>
          <div class="origin-price">￥{{homeData.originPrice}}</div>
        </div>
        <div class="dirvide"></div> <!-- 分割线 -->
        <div class="count-template">
          <span>· {{homeData.questionCount}}道精选题</span>
          <span>· {{homeData.peopleTest}}人测过</span>
        </div>
      </div>

    </div>

    <div class="introduce-template">
      <div class="title">内容简介</div>
      <div class="content-template" v-html="parseLineFeed(homeData.contentValidity, 2)"></div>
    </div>
    <div class="introduce-template">
      <div class="title">你将获得</div>
      <div class="content-template" v-html="parseLineToTagDiv(homeData.yourHarvest)">
      </div>
    </div>
    <div class="introduce-template">
      <div class="title">适合推测</div>
    </div>
    <div class="introduce-template">
      <div class="title">理论背景</div>
      <div class="content-template" v-html="parseToColorBgContent(homeData.contentValidity, 2)"></div>
    </div>

    <div class="dirvide-special">
      <div class="line"></div>
      <div class="circle"></div>
      <div class="line"></div>
    </div>

    <div class="professional-parameters">
      <div class="title">专业参数</div>
      <div class="content" v-html="parseLineFeed(homeData.notice)">
        · 专业报告：123
      </div>
    </div>

    <div class="fixed-bar">
      <img class="icon" src="../assets/我的报告.png" />
      <div class="btn" @click="payAPI">
        立即购买
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

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
  notice = 'notice',
  reference = 'references'
}

@Component({
  components: {
  }
})
export default class Home extends Vue {
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
    professionalTheory: '',
    notice: ''
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

        this.homeData.id = data[cv.id]
        this.homeData.name = data[cv.name]
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
        this.homeData.notice = data[cv.notice]
        this.homeData.reference = data[cv.reference]

        // 用户是否有未完成的数据
        this.$root.haveUnDone = data.undone as boolean

        document.title = this.homeData.name
        this.$root.bannerPic = this.homeData.bannerPic
      }
    })
  }

  // 公众号相关支付信息
  private wechatPublicPayWayData(wechatpubpay: webchatpubpay) {
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

  // 支付接口
  private async payAPI() {
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
        let query = ''
        if (this.$root.channel === 1) { // 1 是微信
          query = 'wechatpubpay'
          this.wechatPublicPayWayData(res.data.data.pay_platforms[query] as webchatpubpay)
        }
      }

      // 已经购买 但是还没有完成的测评
      if (res.data.status === 10005) {
        this.$router.push('/cw')
      }
    })
  }

  private created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
  @import "Home.scss";
</style>

<style lang="scss">
  .tag-content {
    position: relative;
    width: px2html(240px);
    margin-left: px2html(27px);
    margin-bottom: px2html(10px);
  }
  .tag-content:last-of-type {
    margin-bottom: px2html(0px);
  }
  .tag-content::before {
    position: absolute;
    left: px2html(-27px);
    top: px2html(2px);
    content: '';
    width: px2html(12px);
    height: px2html(16px);
    background: url("../assets/tag_icon.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  .color-bg-content {
    border-radius: px2html(10px);
    background: #FAFAFA;
    box-sizing: border-box;
    padding: px2html(20px) px2html(16px);
  }
</style>
