<template>
    <div class='tips animated fadeIn'>{{text}}</div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator'

@Component({
    components: {}
})
export default class Tips extends Vue {
    @Prop([String, Number]) private readonly text: string | undefined | number
}
</script>

<style lang="scss" scoped>
.tips {
    border-radius: px2html(5px);
    width: px2html(140px);
    height: px2html(58px);
    background: rgba(0, 0, 0, 0.76);
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: px2html(20px);
    color: #FFFFFF;
    font-size: px2html(14px);
    position: fixed;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
</style>
