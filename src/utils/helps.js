/*首字母大写*/
export const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());

/**
 * 生成下拉数据
 * @param labelProp String
 * @param valueProp String
 * @returns Object 下拉数据
 */
export const generatedOptions = (labelProp = 'label', valueProp = 'value') => (originSource) => {
    return Object.keys(originSource).map(key => ({[labelProp]: key, [valueProp]: originSource[key]}))
}

/**
 * 魔法值，神仙数字 映射成 人类能识别的字符串：）
 * @param key 需要映射的魔法值
 */
export const mappingValue = (key) => (source, mappingProp = 'label') => {
    const map = source.reduce((map, sourceTarget) => {
        map[sourceTarget.value] = sourceTarget[mappingProp];
        return map;
    }, {})
    return map[key]
}

// 获取cookie、
export const getCookie = (cname) => {
    let name = `${cname}=`
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
    }
    return ''
}

// 设置cookie,增加到vue实例方便全局调用
export const setCookie = (cName, value, expiredays) => {
    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 删除cookie
export const delCookie = (name) => {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = getCookie(name)
    if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
}
