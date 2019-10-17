<template>
    <div class='loading'>
        <div class="greed">
            <img src="../assets/Loading-common.gif"/>
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
}
</script>

<style lang="scss" scoped>
    .loading {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background: #fff;
        z-index: 99999;
        .greed {
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0px;
            top: 0px;
            background: rgba(0, 0, 0, 0.5);
            @include flexCenter;
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
