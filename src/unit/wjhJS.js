export default class wjhTool {
  static promiseForBoolean (obj = {}) {
    let interval; let promise; let save = {}
    Object.assign(save, obj)
    const func = (resolve) => {
      if (obj.boolean === !save.boolean) {
        clearInterval(interval)
        resolve()
      }
    }
    promise = new Promise((resolve, reject) => {
      interval = setInterval(func.bind(null, resolve), 1000)
    })
    return promise
  }

  static getAPIData (url, obj = {}, callback, arg = {}) {
    const api = new new XMLHttpRequest()
    let paramsString = ''

    api.open('GET', url)

    api.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (callback) callback()
      }
    }

    api.setRequestHeader('Content-Type', 'application/json')

    for (let { val, key } of arg) {
      paramsString += key + '=' + val + '&'
    }

    paramsString.replace(/&$/, '')

    api.send()
  }

  static parseQuery(url) {
    let queryObj = {}
    let reg = /[?&]([^=&#]+)=([^&#]*)/g
    let querys = url.match(reg)
    if (querys) {
      for (let i in querys) {
        let query = querys[i].split('=')
        let key = query[0].substr(1)
        let value = query[1]
        queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
      }
    }
    return queryObj
  }

  static randomNum (minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10)
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      default:
        return 0
    }
  }

  static musicCount (value) {
    var secondTime = parseInt(value)// 秒
    var minuteTime = 0// 分
    var hourTime = 0// 小时
    if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
      // 获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      // 获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      // 如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        // 获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        // 获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    let mark = ''
    if (parseInt(secondTime) < 10) {
      mark = '0'
    }
    var result = mark + parseInt(secondTime) + ' '

    let mark2 = '0'

    result = mark2 + parseInt(minuteTime) + ' : ' + result

    if (hourTime > 0) {
      result = '' + parseInt(hourTime) + '小时' + result
    }
    return result
  }

  static dateFormat (date, format) { // yy:mm:ss //这样都行 yyyy年MM月dd日hh时mmmm分sss秒
    if (!format || typeof format !== 'string') {
      console.error('format is undefiend or type is Error')
      return ''
    }

    date = date instanceof Date ? date : (typeof date === 'number' || typeof date === 'string') ? new Date(date) : new Date()

    // 解析
    let formatReg = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let reg in formatReg) {
      if (new RegExp(reg).test(format)) {
        let match = RegExp.lastMatch // 上一次的匹配到的字符串
        format = format.replace(match, formatReg[reg] < 10 ? '0' + formatReg[reg] : formatReg[reg].toString()) // formatReg[reg]< 10 ? '0'+formatReg[reg]:  这段代码不知道有什么作用 暂时删除  2019年03月18日11:42:24 补回来，因为是添加0的
      }
    }
    return format
  }

  static judgeWeiXin () { // 判断是否是微信 和 qq
    let z = null
    if (window.navigator.userAgent.toLowerCase().match(/QQ/i)) {
      z = window.navigator.userAgent.toLowerCase().match(/QQ/i)[0]
    }
    if (!/micromessenger/.test(navigator.userAgent.toLowerCase()) && z !== 'qq') {
      return false
    } else {
      return true
    }
  }

  static deepCopy (obj) {
    let temp = obj.constructor === Array ? [] : {}
    for (let val in obj) {
      temp[val] = typeof obj[val] === 'object' ? wjhTool.deepCopy(obj[val]) : obj[val]
    }
    return temp
  }

  static sort_ASCII (obj) {
    let arr = []
    let num = 0
    for (const i in obj) {
      arr[num] = i
      num++
    }
    let sortArr = arr.sort()
    let sortObj = {}
    for (const i in sortArr) {
      sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj
  }

  static funcUrlDel (name) {
    let loca = window.location
    let baseUrl = loca.origin + loca.pathname + '?'
    let query = loca.search.substr(1)
    if (query.indexOf(name)>-1) {
      let obj = {}
      let arr = query.split('&')
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split('=')
        obj[arr[i][0]] = arr[i][1];
      }
      delete obj[name]
      let url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,'').replace(/\:/g,'=').replace(/\,/g,'&')
      return url
    }
  }

  static changeUrlArg(url, arg, val){
    let pattern = arg+'=([^&]*)'
    let replaceText = arg+'='+val
    return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText)
  }
}
