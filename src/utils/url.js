/** *
 * 构造 search
 * @param sObj
 * @returns {value}
 */
export function stringifySearch (sObj) {
  return Object.keys(sObj)
    .map(m => `${m}=${sObj[m]}`)
    .join('&')
}

/** *
 * 解析 search params
 * @param search
 * @returns {value}
 */
export function parseSearchAll (search) {
  return decodeURI(search)
    .split('&')
    .reduce((a, c) => {
      return {
        ...c,
        [a.split('=')[0]]: a.split('=')[1]
      }
    }, {})
}

/** *
 * 解析 search param
 * @param search
 * @param name
 * @returns {value}
 */
export function parseSearch (search, name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`) // 构造一个含有目标参数的正则表达式对象
  let r = decodeURI(search).match(reg) // 匹配目标参数
  if (r != null) return r[2]
  return null // 返回参数值
}

/** *
 * 解析地址栏 params
 * @param name
 * @returns {value}
 */
export function parse (name) {
  return parseSearch(location.search.substr(1), name)
}

export function parseAll () {
  return parseSearchAll(location.search.substr(1))
}

export default {
  parse,
  parseAll,
  parseSearch,
  parseSearchAll,
  stringifySearch
}
