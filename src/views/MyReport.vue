<template>
    <div class='my-report'>
        <!-- <div class="template">
            <div class="title">啊的都阿</div>
            <div class="time">2019.09.17  08:55</div>
            <div class="order">
                <span class="prefix">订单编号：</span>
                <span class="num">9527</span>
                <img class="icon" src="../assets/myreport_icon@3x.png"/>
            </div>
            <div class="btn">查看报告</div>
        </div> -->
        <div class="null-template">
            <img class="pic" src="../assets/myreport_null@3x.png"/>
        </div>
        <div class="null-bar">
            <div class="title">阿松大</div>
            <div class="price-div">
                <span class="price">￥2</span>
                <div class="origin-price">￥3</div>
            </div>
            <div class="btn">立即购买</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component({
    components: {}
})
export default class MyReport extends Vue {
    private mounted() {
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
            top: px2html(-50px);
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
        .btn {
            width: px2html(142px);
            height: px2html(40px);
            color: #fff;
            border-radius: px2html(21px);
            font-size: px2html(14px);
            line-height: px2html(20px);
            @include flexCenter;
            position: absolute;
            right: px2html(32px);
            background: #FF5454;
            top: px2html(28px);
        }
        .title {
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
