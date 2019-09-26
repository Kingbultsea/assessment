<template>
    <div class='result-page'>
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
            <p class="result-name">哲学家</p>
            <div class="self-time">
                <div class="users-features">
                    <img class="head-pic" :src="headPic"/>
                    {{name}}
                </div>
                <div class="time">{{rpData.assessment_time}}</div>
            </div>
        </div>

        <div class="btn" @click="showNotice = true">
            <img src="../assets/result_button.png"/>
        </div>

        <div class="section">
            <div class="title">
                <div class="num">01</div>
                <div class="content">{{section.sectionOne.levelOneTitle}}</div>
            </div>
            <div class="content-template" style="padding: unset;display: flex;justify-content: center;align-items: center;flex-direction: column">
                <p class="chart-title">{{section.sectionOne.chartPicTitle}}</p>
                <div id="chart" class="chart"></div>
                <p class="chart-explan">{{section.sectionOne.chartExplan}}</p>
                <p class="levelTwo-title">{{section.sectionOne.levelTwoTitle}}</p>
                <p class="levelTwo-text" v-html="parseLineFeed(section.sectionOne.text, 2)"></p>
            </div>
        </div>

        <div class="section sectionTwo">
            <div class="title">
                <div class="num">02</div>
                <div class="content">{{section.sectionTwo.data.levelOneTitle}}</div>
            </div>
            <div class="content-template">
                <div class="levelTitle">{{section.sectionTwo.data.levelTwoTitle}}</div>
                <div class="levelText">
                    {{section.sectionTwo.data.text}}
                </div>
            </div>
            <div class="content-template" v-for="(li, index) in section.sectionTwo.release" :key="index">
                <div class="levelTitle">{{li.levelTwoTitle}}</div>
                <div class="levelText">
                    {{li.text}}
                </div>
            </div>
        </div>

        <div class="section sectionTwo">
            <div class="title">
                <div class="num">03</div>
                <div class="content">{{section.sectionThree.data.levelOneTitle}}</div>
            </div>
            <div class="content-template">
                <div class="levelTitle">{{section.sectionThree.data.levelTwoTitle}}</div>
                <div class="levelText">
                    {{section.sectionThree.data.text}}
                </div>
            </div>
            <div class="content-template" v-for="(li, index) in section.sectionTwo.release" :key="index">
                <div class="levelTitle">{{li.levelTwoTitle}}</div>
                <div class="levelText">
                    {{li.text}}
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
    private showNotice: boolean = false
    private headPic: string | null = localStorage.getItem('avatar') // 用户头像
    private title: string = document.title
    private name: string | null = localStorage.getItem('name')
    private section: any = {
        sectionOne: {
            levelOneTitle: '',
            chartPicTitle: '',
            levelTwoTitle: '',
            text: ''
        },
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
                console.log(res.data.data)
                this.section = res.data.data.section
                this.rpData = res.data.data
                this.parseCharts()
            }
        })
    }

    private parseCharts() {
        const myChart = echarts.init(document.getElementById('chart'))

        const documentChart =  document.querySelector('#chart') as HTMLBaseElement

        // 绘制图表
        myChart.setOption({
            // tooltip: {},
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#333333'
                    }
                },
                indicator: [
                    { name: '销售', max: 100 },
                    { name: '管理', max: 100 },
                    { name: '信息技术', max: 100 },
                    { name: '客服', max: 100 }
                ]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                color: '#2196F3',
                areaStyle: {
                    color: {
                        type: 'radial',
                        x: documentChart.clientWidth / 2,
                        y: documentChart.clientHeight / 2,
                        r: 100,
                        colorStops: [{
                            offset: 0, color: 'rgba(33,150,243,0.3)' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#2196F3' // 100% 处的颜色
                        }],
                        global: true // 缺省为 false
                    }
                },
                data : [
                    {
                        value : [100, 10, 100, 100],
                        name : '预算分配（Allocated Budget）'
                    }
                ]
            }]
        })
    }

    private async created() {
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
