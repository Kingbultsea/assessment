<template>
    <div class='my-report' id="report">
        <Tips v-if="showTips" @click="showTips = false" text="复制成功"/>

        <div class="template" v-for="(li, index) in dataList" :key="index">
            <div class="title">{{li.title}}</div>
            <div class="time">{{li.assessment_time}}</div>
            <div class="order">
                <span class="prefix">订单编号：</span>
                <span class="num" :id="li.order_number">{{li.order_number}}</span>
                <img @click="copyNumber(li.order_number)" class="icon" src="../assets/myreport_icon@3x.png"/>
            </div>
            <div class="btn" @click="viewReport(li.id, li.theme_color)">查看报告</div>
        </div>
        <div class="null-template" v-if="nullList === '1'">
            <img class="pic" src="../assets/myreport_null@3x.png"/>
        </div>
        <div class="null-bar" v-if="nullList === '1'">
            <div class="title">{{goodsDesc.title}}</div>
            <div class="price-div">
                <span class="price">￥{{goodsDesc.price}}</span>
                <div class="origin-price">￥{{goodsDesc.price_origin}}</div>
            </div>
            <div class="btn" id="test" :class="{'fix-top': goodsDesc.title.length <= 8 ? true : false}" @click="pay()">立即购买</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import Tips from '@/components/Tips.vue'

@Component({
    components: {
        Tips
    }
})
export default class MyReport extends Vue {
    private showTips: boolean = false // 展示提示
    private isGetData: boolean = false // 数据正在获取中
    private goodsDesc: any = {
        id: '',
        title: '',
        price_origin: '',
        price: ''
    }
    private nullList: string = '0'
    private dataList: any = []
    private pageIndex: number = 0
    private getPageDone: boolean = false // 是否有下一页
    // 服务器上获取data
    private getData(page = 1 as number) {
        if (this.getPageDone || this.isGetData) {
            return
        }
        this.isGetData = true // 数据正在获取中
        this.$root.loading = true
        this.pageIndex += 1

        const PARAMS = { id: this.$root.id, page: this.pageIndex } as any

        this.$axios.get('/api/assessments/reports', { params: PARAMS }).then((res: any) => {
            if (res.data.status === 0) {
                this.isGetData = false
                // console.log('???')
                this.dataList = this.dataList.concat(res.data.data.list)
                if (this.dataList.length === 0) {
                    this.nullList = '1'
                    this.getPageDone = true
                }

                if (res.data.data.paging.page_total === res.data.data.paging.curr) {
                    // console.log('done page', res.data.data.page_total, res.data.data.curr)
                    this.getPageDone = true
                    this.$root.loading = false
                    return
                }

                // if (this.dataList.length === 1) {
                //     this.viewReport(this.dataList[0].id)
                //     return
                // }
                // this.goodsDesc = res.data.data.default
                this.$root.loading = false
            }
        })
    }

    // 立刻购买
    private pay() {
        this.$root.payAPI()
    }

    // 内容复制
    private copyNumber(id: any) {
        if (this.showTips) {
            return
        }
        const Url2: any = document.getElementById(id)
        if (Url2) {
            window.getSelection()!.selectAllChildren(Url2)
            this.showTips = true
            document.execCommand ('Copy')
            // document.execCommand('copy', false, undefined)
            setTimeout(() => {
                this.showTips = false
            }, 2000)
        }
    }

    // 底部加载
    private getPageReportList() {
        const u = navigator.userAgent
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1

        let toTop = 12340
        this.$nextTick(() => {
            const sectionElement = document.querySelector('#report') as HTMLBaseElement
        })

        const scrollFunc = () => {
            if (!this.$root.canScroll) {
                // console.log('remove scroll')
                window.document.removeEventListener('scroll', scrollFunc)
                return
            }
            // console.log('scroll func')
            const sectionElement = document.querySelector('#report') as HTMLBaseElement
            if (sectionElement) {
                toTop = sectionElement.offsetHeight
            }
            if (this.isGetData) { // 数据正在获取中
                return
            }
            if (this.getPageDone) { // 如果页数已经尽头的话那么无需请求
                // console.log('scroll func done')
                window.document.removeEventListener('scroll', scrollFunc)
                return
            }
            // console.log('scroll', toTop, window.document.documentElement.scrollTop, window.screen.height -
            // window.innerHeight, window.screen, document.body.scrollTop) // document.body.scrollTop 兼容微信

            // 兼容安卓和ios
            let scrollSize = window.document.documentElement.scrollTop + window.screen.height
            if (isAndroid) {
                scrollSize = document.body.scrollTop + window.screen.height
            }
            // console.log(scrollSize >= toTop, scrollSize, toTop, '查看')

            if (scrollSize >= toTop) {
                // console.log('底部')
                this.getData()
            }
        }

        this.$nextTick(() => {
            // scrollFunc()
        })

        window.document.addEventListener('scroll', scrollFunc)
    }

    // 跳转到正确的style_id
    private link2Style(serveName: string) {
        this.$root.loading = true
        const styleId = this.$wjh.parseQuery(window.location.href) as any
        if (serveName === '默认' || serveName === '蓝色理性主题') {
            if (styleId.style_id) {
                window.location.href = this.$wjh.funcUrlDel('style_id') + '#/rp'
                return
            }
        }

        if (serveName === '橙色感性主题') {
            if (parseInt(styleId.style_id) !== 2) {
                window.location.href = this.$wjh.changeUrlArg(window.location.href.split('#')[0], 'style_id', '2') + '#/rp'
                return
            }
        }
        this.$router.push('/rp')
    }

    private viewReport(id: string, serveName: string) {
        sessionStorage.setItem('reportId', id)
        this.link2Style(serveName)
        // this.$router.push('/rp')
    }

    private async mounted() {
        this.$root.loadingText = '数据加载中…'
        this.$root.canScroll = true
        this.$root.loading = true
        window.scrollTo(0, 0)
        this.goodsDesc = {
            id: this.$root.id,
            title: sessionStorage.getItem('title'),
            price_origin: sessionStorage.getItem('originPrice'),
            price: sessionStorage.getItem('price')
        }
        this.getData() // getPageReportList会首次执行
        this.getPageReportList()
        document.title = '我的报告'
    }
}
</script>

<style lang="scss" scoped>
.my-report {
    letter-spacing: initial !important;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
    position: relative;
    padding-bottom: px2html(110px);
}
    .template {
        margin-top: px2html(20px);
        border-radius: px2html(5px);
        box-sizing: border-box;
        background: #fff;
        width: px2html(343px);
        text-align: justify;
        padding: px2html(20px) px2html(16px) px2html(16px) px2html(16px);
        position: relative;
        .title {
            font-weight: 600;
            font-size: px2html(14px);
            line-height: px2html(20px);
            color: #000000;
        }
        .time {
            margin-top: px2html(17px);
            font-size: px2html(12px);
            line-height: px2html(17px);
        }
        .order {
            font-size: px2html(12px);
            line-height: px2html(17px);
            margin-top: px2html(2px);
            display: flex;
            align-items: center;
            .prefix {
                color: #999999;
                opacity: 0.5;
            }
            .icon {
                margin-left: px2html(10px);
                height: px2html(12px);
            }
        }
        .btn {
            position: absolute;
            color: #fff;
            width: px2html(84px);
            height: px2html(28px);
            @include flexCenter;
            font-size: px2html(12px);
            border-radius: px2html(14px);
            background: #2EA1FF;
            line-height: px2html(20px);
            right: px2html(10px);
            bottom: px2html(21px);
        }
    }

    .null-template {
        height: 100vh;
        @include flexCenter;
        .pic {
            position: relative;
            top: px2html(-30px);
            width: px2html(118px);
        }
    }
    .null-bar {
        width: 100vw;
        position: fixed;
        bottom: 0px;
        left: 0px;
        padding: px2html(20px) px2html(32px) px2html(10px) px2html(32px);
        box-sizing: border-box;
        background: #fff;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .btn {
            width: px2html(142px);
            height: px2html(40px);
            color: #fff;
            border-radius: px2html(21px);
            font-size: px2html(14px);
            line-height: px2html(20px);
            @include flexCenter;
            background: #FF5454;
        }
        .title {
            width: 100%;
            line-height: px2html(28px);
            font-size: px2html(20px);
            font-weight: 600;
            color: #000000;
        }
        .price-div {
            display: flex;
            align-items: baseline;
        }
            .price {
                color: #FF524C;
                font-size: px2html(18px);
                font-weight: 600;
            }
            .origin-price {
                position: relative;
                height: px2html(12px);
                display: inline-block;
                font-size: px2html(12px);
                color: rgba(153, 153, 153, 0.63);
                margin-left: px2html(10px);
            }
            .origin-price::after {
                line-height: px2html(12px);
                content: '';
                width: 100%;
                height: px2html(1px);
                background-color: #999999;
                position: absolute;
                left: 0px;
                top: 50%;
                transform: translateY(50%);
            }

    }
</style>
<style lang="scss">
    .fix-top {
        position: relative;
        top: px2html(-20px);
    }
</style>
