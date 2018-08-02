// 获取cookie、
function getCookie (cname) {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}

// 设置cookie,增加到vue实例方便全局调用
function setCookie (cName, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 删除cookie
function delCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// HTMLEncode
function HTMLEncode (html) {
  var temp = document.createElement('div');
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html)
  var output = temp.innerHTML
  temp = null
  return output
}

// HTMLDecode
function HTMLDecode (text) {
  var temp = document.createElement('div')
  temp.innerHTML = text
  var output = temp.innerText || temp.textContent
  temp = null
  return output
}

function jump (resHeight) {
  let total = resHeight
  let distance = document.documentElement.scrollTop || document.body.scrollTop
  // 平滑滚动，时长500ms，每10ms一跳，共50跳
  let step = total / 50
  if (total > distance) {
    smoothDown()
  } else {
    let newTotal = distance - total + 100
    step = newTotal / 50
    smoothUp()
  }

  function smoothDown () {
    if (distance < total) {
      distance += step
      // Firefox
      document.documentElement.scrollTop = distance
      // Chrome
      document.body.scrollTop = distance
      setTimeout(smoothDown, 10)
    } else {
      document.documentElement.scrollTop = total
      document.body.scrollTop = total
      window.pageYOffset = total
    }
  }

  function smoothUp () {
    if (distance > total) {
      distance -= step
      // Firefox
      document.documentElement.scrollTop = distance
      // Chrome
      document.body.scrollTop = distance
      setTimeout(smoothUp, 10)
    } else {
      document.documentElement.scrollTop = total
      document.body.scrollTop = total
      window.pageYOffset = total
    }
  }
}

function timestampToTime (timestamp) {
  let date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}

export default {
  getCookie,
  setCookie,
  delCookie,
  HTMLEncode,
  HTMLDecode,
  jump,
  timestampToTime
}
