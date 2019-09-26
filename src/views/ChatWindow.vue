<template>
    <div class='chat-window'>
        <div class="speed-of-progress">
            <div class="bar-template"><div :style="{ width: (((index) / list.length) * 100) + '%' }" class="bar"></div></div>
            <div class="counter">
                {{index}}/{{list.length}}
            </div>
        </div>

        <div class="mg-bottom"></div>

        <div class="chat-template">
            <transition-group name="list-complete">
                <template v-for="(li, index) in robotAction">
                    <div class="request list-complete-item" v-if="li.from === 'robot'" :key="index">
                        <img class="head-pic animated fadeIn" src="../assets/cosleep.png"/>
                        <div class="content">
                            <p class="type">单选题</p>
                            <p class="title">{{li.title}}</p>
                            <div class="dirvide" v-show="li.open"></div>
                            <div class="choices">
                                <div class="options" v-if="li.open" v-for="(li2, index2) in li.options" :key="index2" @click="chooseActions(li.id, index2, li2.desc, li, index)">
                                    <div class="circle-template"><div v-show="li.selectIndex === index2" class="circle"></div></div>
                                    <p style="width: 75%">{{li2.desc}}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="response list-complete-item" v-if="li.from === 'user'" :key="index">
                        <div class="content">
                            <div class="text">{{li.answer}}</div>
                            <div class="replay" @click="editActions(index - 1)"><img src="../assets/response_replay.png"/></div>
                        </div>
                        <img class="head-pic animated fadeIn" :src="avatar"/>
                    </div>
                </template>
            </transition-group>
        </div>

        <div class="bottom-bar" v-show="showSubmit">
            <div class="btn" @click="submitData('submit')">提交</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

// 是提交总数据还是保存当前
type submitUsersType = 'submit' | 'save'

@Component({
    components: {}
})
export default class ChatWindow extends Vue {
    private list: listData[] = []
    private users: usersAction[] = [] // 用户操作
    private avatar: string | null = localStorage.getItem('avatar') // 用户头像

    private robotAction: Array<listAction | usersAction> = [] // 相当于一个暂存区了
    private index: number = 0 // 当前题目index

    private showSubmit: boolean = false // 展示底部的提交按钮

    // 获取题目信息/?>
    private getTopicList(saverMode = false as boolean) {
        return new Promise((resolve) => {
            this.$axios.get('/api/assessments/question', { params: { id: this.$root.id } }).then((res: any) => {
                if (res.data.list) { // 接口不规范 存在问题 成功不返回status
                    this.list = res.data.list as listData[]

                    // 初始化第一题 saverMode是判断当前用户是否有漏题
                    if (!saverMode) {
                        const parse = this.parseToListAction(this.list[this.index])
                        this.actions(parse)
                    }

                    resolve()
                }
            })
        })
    }

    // 把listData 转换为listAction
    private parseToListAction(data: listData) {
        const rawData = JSON.parse(JSON.stringify(data)) as listData
        const action = {
            from: 'robot',
            open: true,
            selectIndex: undefined,
            editMode: false
        }
        return Object.assign(action, rawData) as listAction
    }

    // 用户操作 用户选择opetions的时候 传入id 所选的id 该title
    private selectOptions(titleId: number, optionId: number, title: string, li: listAction) {
        const usersAction = {
            from: 'user',
            answer: title,
            selected: optionId,
            qid: titleId
        } as usersAction
        this.actions(usersAction)

        li.open = false // 关闭状态
        li.selectIndex = optionId

        // 下一题 提升到这里 是bar的逻辑问题
        this.index += 1

        // 没有下一题了
        if (this.list.length === this.index) {
            // 打开底部的提交按钮
            this.showSubmit = true
            return
        }

        // 下一题的逻辑
        setTimeout(() => {
            const parse = this.parseToListAction(this.list[this.index]) // 转换数据
            this.actions(parse)
        }, 1000)
    }

    // 答题选择 给什么push 什么 动画通过 那个啥修改
    private actions(data: listAction | usersAction) {
        this.robotAction.push(data)
        // 后面需要操控scroll
        // window.document
        this.$nextTick(() => {
            window.scrollTo(0, document.documentElement.clientHeight)
        })
    }

    // 保存用户目前的答题
    private saveAction() {

    }

    // edit actions 编辑答案 输入题的id 查找该 listData id (如果用index的话， 那么查找robotAction, 修改index的 open状态, 修改index + 1 的答案)
    private editActions(robotIndex: number) {
        if (this.robotAction[robotIndex].open !== undefined) {
            this.robotAction[robotIndex].open = true
        }
        if (this.robotAction[robotIndex].editMode !== undefined) {
            this.robotAction[robotIndex].editMode = true
        }
    }
    // 这是用户重新选择的修改
    private editUsersAction(li: listAction, index: number, desc: string, optionId: number) {
        li.open = false
        li.selectIndex = optionId
        this.robotAction[index + 1].answer = desc
    }

    // 根据listAction的editMode 来选择  selectOptions(li.id, index2, li2.desc, li)   editUsersAction
    private chooseActions(titleId: number, optionId: number, title: string, li: listAction, robotIndex: number) {
        if (li.editMode === true) {
            this.editUsersAction(li, robotIndex, title, optionId)
        } else {
            this.selectOptions(titleId, optionId, title, li)
        }
    }

    // 获取用户未完成的数据
    private getUsersUndoneData() {
        try {
            this.$axios.get('/api/users/assessments/undone', { params: { id: this.$root.id } }).then((res: any) => {
                if (res.data.status === 0) {

                    const undoneData = JSON.parse(res.data.data.undone_data)

                    if (undoneData.length === 0) {
                        console.log('m')
                        const parse = this.parseToListAction(this.list[this.index])
                        this.actions(parse)
                        return
                    }

                    let listAction = [] as listAction[]

                    const userAction = res.data.data.undone_data.map((v: any, index: number) => {
                        const data = this.parseToListAction(this.list[index]) as listAction
                        const selected = v.selected - 1
                        data.selectIndex = selected

                        listAction.push(
                            data
                        )
                        // this.list[index].selectIndex
                        return {
                            from: 'user',
                            answer: data.options[selected].desc,
                            qid: v.qid,
                            selected
                        }
                    }) as usersAction[]

                    this.index = userAction.length - 1

                    for (let i = 0; i < userAction.length; i++) {
                        this.robotAction.push(this.parseToListAction(this.list[i]))
                        this.robotAction.push(userAction[i])
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    // 提交用户的选项到服务器
    private submitData(type = 'submit' as submitUsersType) {
        const usersAction = this.robotAction.filter((f: usersAction | listAction, index: number) => {
            return f.from === 'user'
        }) as usersAction[]

        const selectData = usersAction.map((v: usersAction) => {
            return {
                qid: v.qid,
                selected: v.selected + 1 // 服务器需要 +1
            }
        })

        const data = {
            id: this.$root.id,
            data: JSON.stringify(selectData)
        } //  as usersData

        const url = type === 'submit' ? '/api/assessments/result' : '/api/users/assessments/saveUndone'

        this.$axios.post(url, data).then((res: any) => {
            if (res.data.status === 0) {
                if (type === 'submit') {
                    // this.$root.rpData = res.data.data
                    sessionStorage.setItem('reportId', res.data.data.report_id)
                    this.$router.replace('rp')
                }
                // console.log(res.data.data)
            }
        })
    }

    private destoryed() {
        this.submitData('save')
    }

    private async created() {
        if (!this.$root.token) {
            await this.$root.login()
        }

        // 用户有未完成的 就不需要开头就push数据进去了
        await this.getTopicList(this.$root.haveUnDone)

        console.log('?')

        // 如果用户有未完成data 则查询
        if (this.$root.haveUnDone) {
            this.getUsersUndoneData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "ChatWindow.scss";
.list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active for below version 2.1.8 */ {
    // opacity: 0;
    transform: translateY(30px);
}
.list-complete-leave-active {
    position: absolute;
}
</style>
