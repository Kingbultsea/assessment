<template>
    <div class='result-page animated fadeIn' v-show="initialReady">
        <div class="popup-window" v-if="showNotice" @click.self="showNotice = false">
            <div class="popup animated fadeIn">
                <img @click="showNotice = false" class="close" src="../assets/genereal_close_black@3x.png" />
                <p class="title">报告阅读说明</p>
                <div class="content" v-html="rpData.notice"></div>
            </div>
        </div>

        <img class="header-pic" :src="rpData.banner" />
        <div class="introduce-template">
            <p class="name">{{this.chartTitle ? this.chartTitle : '在职场中，你可能成为一位优秀的：'}}</p><!-- {{title}} -->
            <p class="result-name">{{section.sectionOne.resultTitle}}</p>
            <div class="self-time">
                <div class="users-features">
                    <img class="head-pic" :src="headPic"/>
                    {{name}}
                </div>
                <div class="btn" @click="showNotice = true">
                    <img src="../assets/result_button_explain@3x.png"/>报告说明
                </div>
                <!-- <div class="time">
                    {{rpData.assessment_time}}
                </div> -->
            </div>
        </div>

        <!-- <div class="btn" @click="showNotice = true">
            <img src="../assets/result_button_explain@3x.png"/>阅读说明
        </div> -->
        <div class="time">
            报告生成时间：{{rpData.assessment_time}}
        </div>

        <div class="section" id="section">
            <div class="title">
                <div class="num">01</div>
                <div class="content" v-html="section.sectionOne.levelOneTitle"></div>
            </div>
            <div class="content-template" style="padding: unset;display: flex;justify-content: center;align-items: center;flex-direction: column">
                <p class="chart-title" v-if="section.sectionOne.chartPicTitle" v-html="section.sectionOne.chartPicTitle"></p>
                <StaggeredpPlusMinusChart color-a="#199BF5" color-b="#7BC3F5" color-font="#333333" ref="StaggeredpPlusMinusChart" v-show="chartType === 2" />
                <div id="chart" v-show="chartType !== 2" class="chart"></div>
                <p class="chart-explan" v-if="section.sectionOne.chartExplan" v-html="section.sectionOne.chartExplan"></p>
                <p class="levelTitle fix-bottom-to-20" v-if="section.sectionOne.levelTwoTitle" v-html="section.sectionOne.levelTwoTitle"></p> <!-- v-if="section.sectionOne.levelTwoTitle" v-html="section.sectionOne.levelTwoTitle" -->
                <p class="levelTwo-text fix-bootom-10" v-if="section.sectionOne.text" v-html="parseHTMLICON(section.sectionOne.text)"></p>
                <div class="fix-rest-section" v-for="(li, index) in section.sectionOneRelease">
                    <div class="levelTitle" v-if="li.levelTwoTitle" v-html="li.levelTwoTitle"></div> <!-- -->
                    <div class="levelTwo-text fix-section-one-bottom-10" v-if="li.text" v-html="parseHTMLICON(li.text)"> <!--   -->
                    </div>
                </div>
            </div>
        </div>

        <div class="section sectionTwo">
            <div class="title">
                <div class="num" @click="getIcon(1)">02</div>
                <div class="content" v-html="section.sectionTwo.data.levelOneTitle"></div>
            </div>
            <div class="content-template">
                <div class="levelTitle" v-if="section.sectionTwo.data.levelTwoTitle" v-html="section.sectionTwo.data.levelTwoTitle"></div>
                <div class="levelText fix-bootom-10" v-html="parseHTMLICON(section.sectionTwo.data.text)">
                </div>
                <div class="fix-rest-section" v-for="(li, index) in section.sectionTwo.release" :key="index">
                    <div class="levelTitle" v-if="li.levelTwoTitle" v-html="li.levelTwoTitle"></div>
                    <div class="levelText fix-bootom-10" v-if="li.text" v-html="parseHTMLICON(li.text)">
                    </div>
                </div>
            </div>
        </div>

        <div class="section sectionTwo">
            <div class="title">
                <div class="num">03</div>
                <div class="content" v-html="section.sectionThree.data.levelOneTitle"></div>
            </div>
            <div class="content-template fix-first-child-margin-top">
                <div class="levelTitle" v-if="section.sectionThree.data.levelTwoTitle" v-html="section.sectionThree.data.levelTwoTitle"></div>
                <div class="levelText fix-bootom-10" v-if="section.sectionThree.data.text" v-html="parseHTMLICON(section.sectionThree.data.text)">
                </div>
                <div class="fix-rest-section" v-for="(li, index) in section.sectionThree.release" :key="index">
                    <div class="levelTitle" v-if="li.levelTwoTitle" v-html="li.levelTwoTitle"></div>
                    <div class="levelText" v-if="li.text" v-html="parseHTMLICON(li.text)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import StaggeredpPlusMinusChart from '@/components/StaggeredpPlusMinusChart.vue'
const echarts = require('echarts')

@Component({
    components: {
        StaggeredpPlusMinusChart
    }
})
export default class ResultPage extends Vue {
    private chartType: number = 0 // 绘制结果图的样式
    private chartTitle: string = ''
    private initialReady: boolean = false // 初始化渲染
    private myChart: any = undefined // 图表引用 拿来设置数据展开效果
    private iconList: any[] = [
        require(`../assets/resultIconList/1@3x.png`),
        require(`../assets/resultIconList/2@3x.png`),
        require(`../assets/resultIconList/3@3x.png`),
        require(`../assets/resultIconList/4@3x.png`),
        require(`../assets/resultIconList/5@3x.png`),
        require(`../assets/resultIconList/6@3x.png`),
        require(`../assets/resultIconList/7@3x.png`),
        require(`../assets/resultIconList/8@3x.png`),
        require(`../assets/resultIconList/9@3x.png`)
    ]
    private canParseCharts: boolean = false // 能否渲染报告
    private showNotice: boolean = false
    private headPic: string | null = localStorage.getItem('avatar') // 用户头像
    private name: string | null = localStorage.getItem('name') // 用户名称
    private title: string = document.title
    private dimensions: any = {}
    private section: any = {
        sectionOne: {
            resultTitle: '-',
            levelOneTitle: '',
            chartPicTitle: '',
            levelTwoTitle: '',
            text: ''
        },
        sectionOneRelease: [
        ], // { levelTwoTitle: '123', text: '1233313212asdasd啊实打实大苏打实打实大苏打实打实大苏打啊实打实大苏打' },
        // { levelTwoTitle: '234', text: '1233313212asdasd啊实打实大苏打实打实大苏打实打实大苏打啊实打实大苏打' }
        sectionTwo: {
            data: {
                levelOneTitle: ''
            },
            release: []
        },
        sectionThree: {
            data: {
                levelOneTitle: ''
            },
            release: [] // { levelTwoTitle: '123', text: '1233313212asdasd啊实打实大苏打实打实大苏打实打实大苏打啊实打实大苏打' },
            // { levelTwoTitle: '234', text: '1233313212asdasd啊实打实大苏打实打实大苏打实打实大苏打啊实打实大苏打' }
        }
    } // 先设置any

    private rpData: any = {
        assessment_time: '',
        banner: '',
        title: '',
        notice: ''
    }

    // 换行功能
    public parseLineFeed(text: string, times: number): string {
        return text.replace(/script/g, '').replace(/\n/g, '<br/>'.repeat(times))
    }

    // 获取用户测评报告列表api
    private getReportListId() {
        this.$axios.get('/api/assessments/reports', { params: { id: this.$root.id } }).then((res: any) => {
            // console.log(res)
        })
    }

    private _ref(s: string) { // editContentArea
        const ref: any = this.$refs[s]
        return ref
    }

    // 从服务器处领取信息
    private getApiData(id: number) {
        this.$axios.get('/api/assessments/reports/find', { params: { id } }).then((res: any) => {
            if (res.data.status === 0) {
                this.initialReady = true
                this.$nextTick(() => {
                    this.dimensions = res.data.data.dimension
                    this.section = res.data.data.section

                    if (res.data.data.card_desc) {
                        this.chartTitle = res.data.data.card_desc
                    }


                    if (res.data.data.chart && Object.keys(res.data.data.chart.position).length > 0 && res.data.data.chart.desc) {
                        console.log('??')
                        this.dimensions = res.data.data.chart.position
                        const chartData = res.data.data.chart
                        this.section.sectionOne.chartExplan = chartData.desc
                        this.chartType = res.data.data.chart.type - 1
                        console.log('have chart', this.chartType)
                    }

                    // 如果没有则为空数组
                    if (!this.section['sectionOneRelease']) {
                        this.section.sectionOneRelease = []
                    }
                    this.rpData = res.data.data
                    this.canParseCharts = true
                    this.parseCharts(false, res.data.data.chart.position) // true 是需要初始化饼图
                    this.delayToParseCharts() // 动画效果
                    this.$root.loading = false
                })
            }
        })
    }

    // 把服务器取得的dimension 转换成charts 的 能看懂 的 数据
    private prrseDimensionToChartsData(dimension: any) {
        const data = []
        for (const i in dimension) {
            if (dimension[i]) {
                data.push({ name: dimension[i].title, value: dimension[i].score, axis_max: dimension[i].axis_max })
            }
        }
        return data
    }

    // 结果页表格处理
    private parseCharts(init: boolean = false, position: any = undefined) {
        if (this.chartType === 2) {
            this._ref('StaggeredpPlusMinusChart').convertPositionServeData(position)
            return
        }

        const chartsData = this.prrseDimensionToChartsData(this.dimensions)
        // const chartsData = [{ name: '测试', value: 5, axis_max: 10 },
        // { name: '测试', value: 5, axis_max: 10 }, { name: '测试', value: 5, axis_max: 10 },
        // { name: '测试', value: 5, axis_max: 10 }]

        const myChart = echarts.init(document.getElementById('chart'))

        const documentChart =  document.querySelector('#chart') as HTMLBaseElement

        const indicator = [] as any
        const value = [] as any

        let maxNumbIndex = 0

        for (const i of chartsData) {
            init === true
                ? value.push(0) // 0 的原因是初始是不需要的
                : value.push(i.value)
            indicator.push({ name: i.name, max: i.axis_max || 1 })
            maxNumbIndex++
        }

        indicator[0].axisLabel =  { show: true, textStyle: { fontSize: 14, color: '#060606' } }

        // 绘制图表
        myChart.setOption({
            // tooltip: {},
            radar: {
                splitNumber: 5,
                splitArea: {
                    areaStyle: {
                        color: ['#fff', '#fff', '#fff', '#fff']
                    }
                },
                axisLabel: {
                    align: 'left',
                    margin: -4,
                    color: 'rgb(168,168,168)',
                    fontSize: 10,
                    formatter: (params: any, index: any) => {
                        const data =  [0, 20, 40, 60, 80, 100]
                        return data[index]
                        // console.log(params.dimensionIndex)
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 1,
                        symbolSize: [10, 20],
                        color: 'rgba(204,204,204,0.4)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(204,204,204,0.4)'
                    }
                },
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#333333'
                    }
                },
                indicator,
                radius: 100
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                color: '#2196F3',
                smooth: true,
                radius: '0%',
                // symbol: 'pin',
                symbol: 'none',
                symbolSize: [0, 1],
                itemStyle: { // 节点数据显示
                    normal: {
                        label: {
                            borderWidth: '0',
                            color: '#2EA1FF',
                            show: true,
                            fontWeight: '500',
                            position: 'inside',
                            formatter: (params: any) => {
                                const change = [
                                    params.value + '\n',
                                    params.value + '     ',
                                    '\n\n' + params.value,
                                    '     ' + params.value
                                ]
                                return change[params.dimensionIndex]
                                // console.log(params.dimensionIndex)
                            }
                        }
                    }
                },
                lineStyle: {
                    width: 1 // 设置一个 图形 的粗细
                },
                areaStyle: {
                    color: 'rgb(33,150,243)'
                    // color: {
                    //     type: 'radial',
                    //     x: documentChart.clientWidth / 2,
                    //     y: documentChart.clientHeight / 2,
                    //     r: 100,
                    //     colorStops: [{
                    //         offset: 0, color: 'rgba(33,150,243,0.3)' // 0% 处的颜色
                    //     }, {
                    //         offset: 1, color: '#2196F3' // 100% 处的颜色
                    //     }],
                    //     global: true // 缺省为 false
                    // }
                },
                data : [
                    {
                        value,
                        name : '预算分配（Allocated Budget）'
                    }
                ]
            }]
        })

        this.myChart = myChart
    }

    private getIcon(name: number): any {
        return this.iconList[name - 1]
        // console.log(icon)
    }

    // 渲染成 灰色 带 ·的样式
    private parseHTMLToindector(data: string) {
        if (data) {
            const saver = data
            data = data.replace(/<div>(\})<\/div>/g, '$1')
            data = data.replace(/<div>(\^\{)<\/div>/g, '$1')
            data = data.replace(/\n/g, '')
            return data.replace(/\^\{(.*?)\}/g, (a: string, b: any): string => {
                // console.log(b, saver, '123 svaer @@@@')
                return `<div class="fix-green-color green-add-10-margin-bottom">${b}</div>`
            })
        }
    }

    // 处理Html数据里面的icon ${1}
    private parseHTMLICON(data: string) {
        data = this.parseHTMLToindector(data) as string
        if (data) {
            return data.replace(/\$\{(.*?)\}/g, (a: string, b: any): string => {
                return `<img src=${this.getIcon(b)} class="result-icon" />`
            })
        }
    }

    private delayToParseCharts() {
        const u = navigator.userAgent
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1

        let toTop = 12340
        this.$nextTick(() => {
            const chartElement = document.querySelector('#chart') as HTMLBaseElement
            const sectionElement = document.querySelector('#section') as HTMLBaseElement
            // 到顶部的位置
            const chartAndSection = chartElement.offsetTop + sectionElement.offsetTop
            toTop = chartAndSection - (window.document.documentElement.clientHeight / 1.1)
        })

        const scrollFunc = () => {

            // 兼容安卓和ios
            let scrollSize = window.document.documentElement.scrollTop
            if (isAndroid) {
                scrollSize = document.body.scrollTop
            }

            // console.log(scrollSize >= toTop)

            if (scrollSize >= toTop && this.canParseCharts) {
                this.parseCharts()
                window.document.removeEventListener('scroll', scrollFunc)
            }
        }

        this.$nextTick(() => {
            scrollFunc()
        })

        window.document.addEventListener('scroll', scrollFunc)
    }

    private async created() {
        this.$root.canScroll = false
        window.document.title = sessionStorage.getItem('title') || '测评报告'
        this.$root.loading = true
        setTimeout(() => {
            // this.parseCharts()
        }, 1000)
        window.scrollTo(0, 0)
        const id = sessionStorage.getItem('reportId')
        if (id) {
            this.getApiData(+id)
        }
        // this.getApiData()
    }
}
</script>

<style lang="scss" scoped>
    @import "ResultPage.scss";
    #chart {
        width: 90%;
        margin-top: 20px;
        margin-bottom: 20px;
        height: px2html(400px);
    }
</style>
<style lang="scss">
    .green-add-10-margin-bottom {
        margin-bottom: px2html(10px) !important;
    }
    .result-icon {
        // transform: translateY(2px);
        height: px2html(18px);
        margin-right: px2html(7px);
        position: relative;
        top: px2html(2px);
    }
    .fix-bottom-to-20 {
        align-self: end;
        position: relative;
        right: px2html(-30px);
        margin-bottom: px2html(20px) !important;
    }
    .fix-bootom-10 {
        div {
            margin-top: px2html(10px);
        }
        >br {
            margin-top: px2html(10px);
        }
    }
    .fix-section-one-bottom-10 {
        div {
            margin-bottom: px2html(10px);
        }
    }
</style>
