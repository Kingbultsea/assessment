<template>
    <div class='loading'>
        <div class="greed">
            <img src="../assets/Loading-common.gif"/>
            <p>{{loadingText}}</p>
        </div>
        <!-- <div class="template">
        </div> -->
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
    components: {}
})
export default class Loading extends Vue {
    private loadingText = localStorage.getItem('loadingtext') || '数据加载中…' // ''
}
</script>

<style lang="scss" scoped>
    .loading {
        // display: none;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        // background: #fff;
        z-index: 99;
        @include flexCenter;
        .greed {
            width: px2html(112px);
            height: px2html(115px);
            box-sizing: border-box;
            // width: 100vw;
            // height: 100vh;
            // position: fixed;
            // left: 0px;
            // top: 0px;
            padding: px2html(20px) px2html(14px) px2html(10px) px2html(14px);
            border-radius: px2html(5px);
            background: rgba(0, 0, 0, 0.85);
            @include flexCenter;
            p {
                width: px2html(100px);
                margin-top: px2html(10px);
                font-size: px2html(12px);
                color: rgba(255, 255, 255, 0.8);
            }
        }

        img {
            width: px2html(40px);
        }
        >.template {
            // display: flex;
            // justify-content: center;
            // align-items: center;
            // flex-direction: column;
            // border-radius: px2html(5px);
            // width: px2html(102px);
            // height: px2html(101px);
            // background: rgba(51, 51, 51, 0.85);
            img {
                width: px2html(50px);
                margin-top: px2html(14px);
            }
            p {
                margin-top: px2html(10px);
                font-size: px2html(12px);
                color: #fff;
            }
        }
    }
</style>
