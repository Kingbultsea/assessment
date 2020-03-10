# Assessment
基于Vue.js开发的一个测评前台展示页面，含有微信分享、微信登录、微信支付、md5加密、第三方可配置性的登录与购买、debugger功能。
布局适配方法采用缩放法，保持所有机型显示一致，暂时不适用于pc端，已添加tailwind.css，将来使用tailwind.css进行改版。
已适配各种型号手机，个别机型出现bug，无法购买与登录等问题，可以提交issues。

![npm](https://img.shields.io/badge/npm-v6.13.1-blue)
![typescript](https://img.shields.io/badge/typescript-v3.4.3-blue)
![vue-cli](https://img.shields.io/badge/vue--cli-v3.11.0-blue)
![vue-cli](https://img.shields.io/badge/node-v10.0.0-blue)

## Docs

## Getting started
package.josn install
```dtd
npm run install
```

配置init.config.js文件。
```typescript
const config = {
  qiniu_cdn: './',
  api: '',
  api_debug: '',
  appid_wx: '',
  link_proxy: '', // 'https://xxxx/proxy?link_actual=' 需要设置的微信链接代理
  key: '' // 盐
}
```

|属性|说明|类型|默认|
|:----    |:-------    |:--- |---|
|qiniu_cdn    |七牛cdn地址    |string |'./'|
|api    |正式服服务器api     |string |''|
|api_debug    |测试服服务器api     |string |''|
|appid_wx    |微信appid    |string |''|
|link_proxy    |需要设置的微信链接代理跳转，通常用于动态调整链接获取code    |string |''|
|key    |盐，用于api的加密解密    |string |''|


运行
```dtd
npm run serve
```

构建
```
// 测试服
npm run experiment

// 正式服
npm run build
```

## Browsers support
已验证华为、小米、三星、苹果5+、oppoR9+、一加、魅族、vivo、ipadmini+、坚果、努比亚适配性，如有个别型号出现BUG，可提交issues。

- ios8+
- android6+

## Project layout

```
.
├── vue.config.js                                # vue-cli/webapck配置文件
├── tslint.json                                      
├── tsconfig.json      
├── postcss.config.js 
├── postcss.config.js 
├── jest.config.js
├── init.config.js                               # 项目初始化配置
├── cdn.js                                       # 七牛cdn配置文件
├── babel.config.js                              # babel配置
├── .env.experiment                              # vuecli experiment环境配置文件
├── tests                                        # 单元测试 自动化测试目录
├── src                                          # 源码目录
│   ├── App.vue                                  # 入口组件
│   ├── main.ts                                  # root组件
│   ├── router.ts                                # 路由配置
│   ├── store.ts                                 # vuex配置文件
│   ├── views                                    # 页面文件夹
├   ├   ├── ResultPage.vue                       # 结果页
├   ├   ├── ResultPage.scss                      # 结果页scss
├   ├   ├── MyReport.vue                         # 我的报告页
├   ├   ├── List.vue                             # 测评集合
├   ├   ├── List.scss                            # 测评集合scss
├   ├   ├── LangdingPage.vue                     # 授权页
├   ├   ├── Home                                 # 首页
├   ├   ├── Home.scss                            # 首页scss
├   ├   ├── ChatWindows.vue                      # 测评问答页面
├   ├   ├── ChatWindows.scss                     # 测评问答页面scss
├   ├   ├── type
├   ├   |   ├── ResultPage.d.ts
├   ├   |   ├── Home.d.ts
├   ├   |   ├── ChatWindow.d.ts
├   ├   ├── unit                                # 小工具js
├   ├   |   ├── setSize.js                      # 根据屏幕等比例设置rem
├   ├   |   ├── shareAndGetName.js              # 用于微信分享（包含微信获取名称，因安全性问题，微信获取信息已交由服务器来处理）
├   ├   |   ├── tool.js                         # 第三方平台工具
├   ├   |   ├── wjh.js                          # 小工具.js
├   ├   ├── type                                # 全局.d.ts
├   ├   |   ├── root.d.ts                       # 全局.d.ts
├   ├   ├── GlobalScss                          # 全局scss
├   ├   |   ├── setSizze.scss                   # 封装适配方法
├   ├   ├── components                          # 组件库
├   ├   |   ├── Loading.vue                     # Loading组件
├   ├   |   ├── StaggeredpPlusMinusChart.vue    # 图表组件
├   ├   |   ├── Tips.vue                        # 提示组件
├   ├   ├── assets                              # 静态文件资源库
.
