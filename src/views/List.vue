<template>
    <div class='list animated fadeIn'>
        <template v-for="(l1, index) in list">
            <div class="category-title" :class="setThemeColor(theme2Val[l1.themeColor])">{{l1.categoryName}}</div>
            <div class="card-group">
                <div class="card" @click="linkTo(l1.assessmentId)">
                    <img class="banner" :src="l1.banner"/>
                    <div class="content">
                        <p class="title">{{l1.title}}</p>
                        <p class="subtitle">{{l1.subtitle}}</p>
                        <div class="tag">
                            <div class="avatars">
                                <div v-for="(li, index) in l1.people_avatar" :key="index" class="avatar-div">
                                    <img :src="li" class="avatar"/>
                                </div>
                            </div>
                            <span class="font">{{l1.people_test}}人</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    interface DATA_SERVE {
        list: LIST[],
        paging: {
            prev: number,
            curr: number,
            next: number,
            page_num: number,
            page_total: number,
            total: number
        }
    }

    type LIST = {
        assessmentId: number, // 测评id
        title: string, // 标题
        subtitle: string, // 副标题
        banner: string, // banner
        themeColor: string, // 主题色
        categoryName: string, // 系列名
        people_test: string, // 测过多少人
        people_avatar: string[] // 随机4个头像
    }

    @Component({
        components: {}
    })
    export default class List extends Vue {
        private theme2Val = {
            默认: 'a',
            蓝色理性主题: 'b',
            橙色感性主题: 'c',
            紫色主题: 'd',
            绿色健康主题: 'e'
        }

        // 设置标题的颜色
        private setThemeColor(str: string) {
            return ['category-title-' + str]
        }

        private list: LIST[] = []

        // 获取测评列表
        private getListData(page: number = 1) {
            this.$root.loading = true
            this.$axios.get('/api/assessments', { params: { page } }).then((res: any) => {
                if (res.data.status === 0) {
                    const DATA = res.data.data as DATA_SERVE
                    this.list = this.list.concat(DATA.list)
                    this.$root.loading = false
                }
            })
        }

        private linkTo(id: number) {
            const removeHashUrl = window.location.href.split('#')[0]
            if (removeHashUrl.includes('?')) {
                window.location.href = removeHashUrl + '&id=' + id
            } else {
                window.location.href = removeHashUrl + '?id=' + id
            }
        }

        private created() {
            this.getListData(1)
        }
    }
</script>

<style lang="scss" scoped>
    @import "List";
</style>
<style lang="scss">
    .list {
        .category-title-a::before {
            display: inline-block;
            width: 100%;
            content: '';
            height: px2html(10px);
            background-color: #2EA1FF;
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%);
            z-index: -1;
            border-radius: px2html(5px);
        }

        .category-title-b::before {
            display: inline-block;
            width: 100%;
            content: '';
            height: px2html(10px);
            background: linear-gradient(#42B7FF, #2EA1FF);
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%);
            z-index: -1;
            border-radius: px2html(5px);
        }

        .category-title-c::before { // 这里也可以用data的绑定方式传入
            display: inline-block;
            width: 100%;
            content: '';
            height: px2html(10px);
            background: linear-gradient(#FFC387, #FFB074);
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%);
            z-index: -1;
            border-radius: px2html(5px);
        }
        .category-title-d::before { // 这里也可以用data的绑定方式传入
            display: inline-block;
            width: 100%;
            content: '';
            height: px2html(10px);
            background: linear-gradient(#E4DCFF, #876EDB);
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%);
            z-index: -1;
            border-radius: px2html(5px);
        }
        .category-title-e::before { // 这里也可以用data的绑定方式传入
            display: inline-block;
            width: 100%;
            content: '';
            height: px2html(10px);
            background: linear-gradient(#57D9A4, #3CC78F);
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translateX(-50%);
            z-index: -1;
            border-radius: px2html(5px);
        }
    }
</style>
