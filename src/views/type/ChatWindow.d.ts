interface listData { // 列表数据
    id: number, // 题目id
    title: string, // 题目标题
    type: number, // 题目类型 目前全是默认1
    options: options[]
}

interface options {
    desc: string
}

interface usersData { // 用户选择的数据
    id: number, // 测评的id
    data: select[] // 数据
}

interface select {
    qid: number, // 题的id
    selected: number // 选择中的选项 1开始
}

interface listAction extends listData {
    from: 'robot',
    open: boolean, // 是否能选择状态
    selectIndex: number | undefined // 选项选中的状态
    editMode: boolean, // 判断是否进行edit模式
    [key: string]: any, // 解决对象的遍历
}
interface usersAction extends select {
    from: 'user',
    answer: string // 回答的问题展示
    [key: string]: any, // 解决对象的遍历
}
