interface sectionOne extends sectionRest {
    // levelOneTitle: string, // 第一节一级标题
    chartPicTitle: string, // 图表标题
    chartExplan: string, // 图表说明
    // levelTwoTitle: string, // 第一节二级标题 （结果类型名称）
    // text: string // 第一节正文（结果描述）
}

interface sectionRest extends levelTwoTitleAndText {
    levelOneTitle: string, // 第二节一级标题
}

// 二级标题 和 正文
interface levelTwoTitleAndText {
    levelTwoTitle: string, // 二级标题
    text: string // 正文（结果描述）
}
