<template>
    <div class='landing-page'>
        <div class="content">
            <img class="pic" src="../assets/get_authorization_icon@3x.png"/>
            <div class="title">专业测评权限说明</div>
            <div class="explain">
                请允许专业测评获得你的公开信息（昵称、头像、地区及性别），以保证测评功能能够正常使用。
            </div>
            <div class="btn">申请授权</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component({
    components: {}
})
export default class LandingPage extends Vue {
    private mounted() {
        document.title = '专业测评'
    }
}
</script>

<style lang="scss" scoped>
.landing-page {
    width: 100%;
    min-height: 100vh;
    @include flexCenter;
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .pic {
            width: px2html(110px);
        }
        .title {
            margin-top: px2html(60px);
            color: #333333;
            font-size: px2html(18px);
            line-height: px2html(25px);
        }
        .explain {
            text-align: justify;
            width: px2html(297px);
            margin-top: px2html(20px);
            color: #333333;
            font-size: px2html(12px);
            line-height: px2html(23px);
        }
        .btn {
            margin-top: px2html(60px);
            width: px2html(140px);
            height: px2html(42px);
            border-radius: px2html(21px);
            background: #2EA1FF;
            @include flexCenter;
            font-size: px2html(14px);
            color: #FFFFFF;
            line-height: px2html(20px);
        }
    }
}
</style>
