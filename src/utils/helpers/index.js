// 自定义辅助函数
import { useUrlSearchParams } from '@vueuse/core'

/**
 * 获取当前 URL 中指定参数的值，不区分参数名的大小写
 * @param {string} paramName 参数名
 * @returns {string} 参数值
 */
export function getUrlParam(paramName) {
    const params = useUrlSearchParams()
    // 遍历对象的键值对，找到匹配的参数名 
    for (const [key, value] of Object.entries(params)) {
        // 如果参数名不区分大小写相等，返回参数值
        if (key.toLowerCase() === paramName.toLowerCase()) {
            return value
        }
    }
    // 如果没有找到匹配的参数名，返回 undefined 
    return undefined
}


/**
 * 根据常见的操作系统和浏览器的特征进行判断，返回的对象格式为 { os: '操作系统', browser: '浏览器' }
 * @returns {object} 操作系统和浏览器
 */
export function getSystemAndBrowser() {

    const ua = navigator.userAgent

    const result = {
        os: 'Unknown',
        browser: 'Unknown'
    }
    
    // oa
    if (/Android/i.test(ua)) {
        result.os = 'Android'
    } else if (/iPhone/i.test(ua)) {
        result.os = 'iOS'
    } else if (/Windows/i.test(ua)) {
        result.os = 'Windows'
    } else if (/Mac OS X/i.test(ua)) {
        result.os = 'Mac'
    } else if (/Linux/i.test(ua)) {
        result.os = 'Linux'
    }

    // browser
    if (/Chrome/i.test(ua)) {
        result.browser = 'Chrome'
    } else if (/wxwork/i.test(ua)) {
        result.browser = 'WeCom'
    } else if (/MicroMessenger/i.test(ua)) {
        result.browser = 'WeChat'
    } else if (/Firefox/i.test(ua)) {
        result.browser = 'Firefox'
    } else if (/Safari/i.test(ua)) {
        result.browser = 'Safari'
    } else if (/Edge/i.test(ua)) {
        result.browser = 'Edge'
    } else if (/Opera/i.test(ua)) {
        result.browser = 'Opera'
    }

    return result
}