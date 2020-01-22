<template>
    <div class="staggeredp-plus-minus-chart" :style="{color: colorFont}">
        <div class="background-line">
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>

            <div class="decloration-line" :style="{backgroundColor: colorA}" style="width: 2px"></div>

            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
            <div class="decloration-line"></div>
        </div>
        <div class="line" v-for="(li, index) in chartConfig" :key="index">
            <div style="width: 24px"><p style="float: right;width: max-content">{{li.name[0]}}</p></div>
            <div class="chart-bar">
                <div class="container">
                    <div :data-number="Math.ceil((li.percent / li.axis_max) * 100) + '%'" class="left-bar" :style="{width: (li.percent / li.axis_max) * 100 + '%', backgroundColor: (li.percent / li.axis_max) * 100 >= 50 ? colorA : colorB}"></div>
                </div>
                <div class="container">
                    <div :data-number="parseInt(100 - ((li.percent / li.axis_max) * 100)) + '%'" class="right-bar" :style="{width: parseInt(100 - ((li.percent / li.axis_max) * 100)) + '%', backgroundColor: ((li.percent / li.axis_max) * 100 < 50 && Math.ceil((li.percent / li.axis_max) * 100) !== 50) ? colorA : colorB}"></div>
                </div>
            </div>
            <div style="width: 24px"><p style="float: left;width: max-content">{{li.name[1]}}</p></div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'
    interface StaggeredPlusMinusChartConfig {
        name: [string, string],
        percent: number,
        axis_max: number // 最大值
    }

    @Component({
        components: {}
    })
    export default class StaggeredpPlusMinusChart extends Vue {
        @Prop(String) private colorA: string | undefined
        @Prop(String) private colorB: string | undefined
        @Prop(String) private colorFont: string| undefined
        private chartConfig: StaggeredPlusMinusChartConfig[] = []

        // 改变position为可用的数据
        private convertPositionServeData(position: any) { // 急 类型还没空补全
            for (const i in position) {
                this.chartConfig.push({
                    name: [position[i].dimension, position[i].title],
                    percent: position[i].score,
                    axis_max: position[i].axis_max
                })
            }
            console.log(
                this.chartConfig
            )
        }
        // protected render() {
        //     return <div>123</div>
        // }
    }
</script>

<style lang="scss" scoped>
    .less-color {
        background-color: #FFE8D6 !important;
    }

    .background-line {
        // overflow: hidden;
        // background-color: rgba(0, 0, 0, 0.5);
        // z-index: -1;
        position: absolute;
        width: 178px;
        height: calc(100% + 38px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        right: 50%;
        top: 50%;
        transform: translateX(50%) translateY(-50%);
        .center-color {
            background: linear-gradient(#FFFFFF, #FFE8D6, #FFE8D6, #FFFFFF) !important;
        }
        .decloration-line {
            // margin-left: 10px;
            // margin-right: 10px;
            height: 100%;
            width: 1px;
            // position: relative;
            // right: -2px;
            background: linear-gradient(#FFFFFF, #F7F7F7, #F7F7F7, #FFFFFF);
        }
    }

    .staggeredp-plus-minus-chart {
        width: 301px;
        font-size: 11px;
        color: #5C5149;
        overflow: hidden;
        position: relative;
        margin: px2html(20px) 0px;
        .line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 19px;
            margin-bottom: 19px;
        }
        .chart-bar {
            width: 178px;
            display: flex;
            height: 18px;
            justify-content: center;
            align-items: baseline;
            .container {
                height: 18px;
                width: 50%;
            }
            .left-bar {
                float: right;
            }
            .left-bar, .right-bar {
                height: 18px;
                background-color: #FFB074;
            }
            .left-bar {
                border-bottom-left-radius: 2px;
                border-top-left-radius: 2px;
                position: relative;
            }
            .left-bar::after {
                position: absolute;
                left: 0px;
                top: 50%;
                transform: translateX(-115%) translateY(-50%);
                content: attr(data-number);
            }
            .right-bar {
                position: relative;
                width: unset;
                border-bottom-right-radius: 2px;
                border-top-right-radius: 2px;
            }
            .right-bar::before {
                position: absolute;
                right: 0px;
                top: 50%;
                transform: translateX(115%) translateY(-50%);
                content: attr(data-number);
            }
        }
    }
</style>
