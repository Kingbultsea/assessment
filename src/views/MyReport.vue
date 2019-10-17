<template>
    <div class='my-report'>
        <Tips v-if="showTips" @click="showTips = false" text="复制成功"/>

        <div class="template" v-for="(li, index) in dataList" :key="index">
            <div class="title">{{li.title}}</div>
            <div class="time">{{li.assessment_time}}</div>
            <div class="order">
                <span class="prefix">订单编号：</span>
                <span class="num" :id="li.order_number">{{li.order_number}}</span>
                <img @click="copyNumber(li.order_number)" class="icon" src="../assets/myreport_icon@3x.png"/>
            </div>
            <div class="btn" @click="viewReport(li.id)">查看报告</div>
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
            <div class="btn" id="test" :class="{'fix-top': goodsDesc.title.length <= 8 ? true : false}" @click="this.$root.payAPI">立即购买</div>
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

    private goodsDesc: any = {
        id: '',
        title: '',
        price_origin: '',
        price: ''
    }
    private nullList: string = '0'
    private dataList: any = []
    private pageIndex: number = 0
    // 服务器上获取data
    private getData(page = 1 as number) {
        this.pageIndex += 1
        this.$axios.get('/api/assessments/reports', { params: { id: this.$root.id, page } }).then((res: any) => {
            if (res.data.status === 0) {
                this.dataList = this.dataList.concat(res.data.data.list)
                if (this.dataList.length === 0) {
                    this.nullList = '1'
                }
                // this.goodsDesc = res.data.data.default
                this.$root.loading = false
            }
        })
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

    private viewReport(id: string) {
        sessionStorage.setItem('reportId', id)
        this.$router.push('/rp')
    }
    private async mounted() {
        this.$root.loading = true
        window.scrollTo(0, 0)
        if (!this.$root.token) {
            await this.$root.login()
        }
        this.goodsDesc = {
            id: this.$root.id,
            title: sessionStorage.getItem('title'),
            price_origin: sessionStorage.getItem('originPrice'),
            price: sessionStorage.getItem('price')
        }
        this.getData()
        document.title = '我的报告'
    }
}
</script>

<style lang="scss" scoped>
.my-report {
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
        border-radius: px2html(10px);
        box-sizing: border-box;
        background: #fff;
        width: px2html(343px);
        text-align: justify;
        padding: px2html(20px) px2html(16px) px2html(16px) px2html(21px);
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
            right: px2html(16px);
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
