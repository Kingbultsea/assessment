<template>
    <div class='result-page animated fadeIn'>
        <div class="popup-window" v-if="showNotice" @click.self="showNotice = false">
            <div class="popup animated fadeIn">
                <img @click="showNotice = false" class="close" src="../assets/genereal_close_black@3x.png" />
                <p class="title">报告阅读说明</p>
                <div class="content" v-html="rpData.notice"></div>
            </div>
        </div>

        <img class="header-pic" :src="rpData.banner" />
        <div class="introduce-template">
            <p class="name">{{title}}</p>
            <p class="result-name">{{section.sectionOne.resultTitle}}</p>
            <div class="self-time">
                <div class="users-features">
                    <img class="head-pic" :src="headPic"/>
                    {{name}}
                </div>
                <div class="time">{{rpData.assessment_time}}</div>
            </div>
        </div>

        <div class="btn" @click="showNotice = true">
            <img src="../assets/result_button_explain@3x.png"/>阅读说明
        </div>

        <div class="section">
            <div class="title">
                <div class="num">01</div>
                <div class="content" v-html="section.sectionOne.levelOneTitle"></div>
            </div>
            <div class="content-template" style="padding: unset;display: flex;justify-content: center;align-items: center;flex-direction: column">
                <p class="chart-title" v-if="section.sectionOne.chartPicTitle" v-html="section.sectionOne.chartPicTitle"></p>
                <div id="chart" class="chart"></div>
                <p class="chart-explan" v-if="section.sectionOne.chartExplan" v-html="section.sectionOne.chartExplan"></p>
                <p class="levelTwo-title" v-if="section.sectionOne.levelTwoTitle" v-html="section.sectionOne.levelTwoTitle"></p>
                <p class="levelTwo-text fix-bootom-10" v-if="section.sectionOne.text" v-html="parseHTMLICON(section.sectionOne.text)"></p>
                <div class="fix-rest-section" v-for="(li, index) in section.sectionOneRelease">
                    <div class="levelTwo-title" v-if="li.levelTwoTitle" v-html="li.levelTwoTitle"></div> <!-- -->
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
            <div class="content-template">
                <div class="levelTitle" v-if="section.sectionThree.data.levelTwoTitle" v-html="section.sectionThree.data.levelTwoTitle"></div>
                <div class="levelText fix-bootom-10" v-html="parseHTMLICON(section.sectionThree.data.text)">
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
const echarts = require('echarts')

@Component({
    components: {}
})
export default class ResultPage extends Vue {
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
    private showNotice: boolean = false
    private headPic: string | null = localStorage.getItem('avatar') // 用户头像
    private title: string = document.title
    private name: string | null = localStorage.getItem('name')
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
            {}, {}
        ],
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
            release: []
        }
    } // 先设置any

    private rpData: any = {
        assessment_time: '',
        banner: '',
        title: '',
        notice: ''
    }

    // 获取用户测评报告列表api
    private getReportListId() {
        this.$axios.get('/api/assessments/reports', { params: { id: this.$root.id } }).then((res: any) => {
            console.log(res)
        })
    }

    // 换行功能
    public parseLineFeed(text: string, times: number): string {
        return text.replace(/script/g, '').replace(/\n/g, '<br/>'.repeat(times))
    }

    // 从服务器处领取信息
    private getApiData(id: number) {
        this.$axios.get('/api/assessments/reports/find', { params: { id } }).then((res: any) => {
            if (res.data.status === 0) {
                this.dimensions = res.data.data.dimension
                this.section = res.data.data.section

                // 如果没有则为空数组
                if (!this.section['sectionOneRelease']) {
                    this.section.sectionOneRelease = []
                }
                this.rpData = res.data.data
                this.parseCharts()
            }
        })
    }

    // 把服务器取得的dimension 转换成charts 的 能看懂 的 数据
    private prrseDimensionToChartsData(dimension: any) {
        let data = []
        for (let i in dimension) {
            data.push({ name: dimension[i].title, value: dimension[i].score, axis_max: dimension[i].axis_max })
        }
        return data
    }

    // 结果页表格处理
    private parseCharts() {
        const chartsData = this.prrseDimensionToChartsData(this.dimensions)
        // const chartsData = [{ name: '测试', value: 5, axis_max: 10 }, { name: '测试', value: 5, axis_max: 10 }, { name: '测试', value: 5, axis_max: 10 }, { name: '测试', value: 5, axis_max: 10 }]

        const myChart = echarts.init(document.getElementById('chart'))

        const documentChart =  document.querySelector('#chart') as HTMLBaseElement

        const indicator = [] as any
        const value = [] as any

        const maxNumb = [16, 12, 18, 16] // 临时加上的
        let maxNumbIndex = 0

        for (let i of chartsData) {
            value.push(i.value)
            indicator.push({ name: i.name, max: i.axis_max || 1 })
            maxNumbIndex++
        }

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
                axisLine: {
                    lineStyle: {
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
                indicator
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                color: '#2196F3',
                itemStyle: {//节点数据显示
                    normal: {
                        label: {
                            color: '#2EA1FF',
                            show: true,
                            fontWeight: '500',
                            position: 'inside',
                            formatter: (params: any) => {
                                let change = [
                                    params.value + '\n\n',
                                    params.value + '     ',
                                    '\n\n' + params.value,
                                    '     ' + params.value
                                ]
                                return change[params.dimensionIndex]
                                console.log(params.dimensionIndex)
                            }
                        }
                    }
                },
                lineStyle: {
                    width: 1
                },
                areaStyle: {
                    color: '#2196F3'
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
    }

    private getIcon(name: number): any {
        return this.iconList[name]
        // console.log(icon)
    }

    // 处理Html数据里面的icon ${1}
    private parseHTMLICON(data: string) {
        if (data) {
            return data.replace(/\$\{(.*?)\}/g, (a: string, b: any): string => {
                return `<img src=${this.getIcon(b)} class="result-icon" />`
            })
        }
    }

    private async created() {
        setTimeout(() => {
            // this.parseCharts()
        }, 1000)
        window.scrollTo(0, 0)
        if (!this.$root.token) {
            await this.$root.login()
        }
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
        height: px2html(400px);
    }
</style>
<style lang="scss">
    .result-icon {
        // transform: translateY(2px);
        height: px2html(9px);
        margin-right: px2html(7px);
    }
    .fix-bootom-10 {
        div {
            margin-top: px2html(10px);
        }
    }
    .fix-section-one-bottom-10 {
        div {
            margin-bottom: px2html(10px);
        }
    }
</style>
