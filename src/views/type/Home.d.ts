interface homeData {
    id: number, // id
    bannerPic: string, // 测评banner图
    name: string, // 测评名称
    viceName: string, // 测评副标
    price: number, // 原价
    originPrice: number, // 活动价
    questionCount: number, // 题目数
    peopleTest: string, // 已有多人测试过
    contentValidity: string, // 内容简介
    yourHarvest: string, // 你的收获 (实际是： 你将获得)
    professionalTheory: string, // 专业理论 （实际是： 理论背景）
    suitableForSpeculation: string, // 适合推测
    notice: string, // 测评须知 & 研发团队 （实际测评须知 这里有修改 修过成专业参数）
    groups: string, // 团队
    groupsPic: string, // 团队图片
    [key: string]: any // 解决对象的遍历 为 any
}
