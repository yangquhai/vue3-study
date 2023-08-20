import axios from 'axios'
import { showNotify, showDialog } from 'vant'

const baseURL = (URL) => {

    return process.env.NODE_ENV === 'development'
        // ? 'https://mock.apifox.cn/m1/1014400-0-default/'
        ? '/api'
        : URL
}

const instance = axios.create({
    timeout: 600000,
    // headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use(
    (config) => {
        document.cookie = 'anywell_ajax_token=20230820181131383432'
        document.cookie = ".ASPXANONYMOUS=AoomSn5ybu_YqtIKURF8k7NOf-FB9gBx6wftQNmcBcJJZ9x0tjfh0bFzSLzxB56PzZzDYvOrCqTkWSQapvziTJybDpZEurZ5PrqujLhLFp7B9V1MU0CBO3uect-l_N3OkGsladizcEGMprG-yi0tfA2"
        document.cookie = "ASP.NET_SessionId=juf05u2nce0lnvyl55m3a4up"
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        if (response.data.code >= 200 && response.data.code < 300) {
            return response.data
        } else {
            return Promise.reject(response.data)
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)

const request = (options) => {
    const { url, api, data, method, header } = options
    return instance({
        url: baseURL(url) + api,
        data,
        method: method || 'GET',
        headers: header || { 'Content-Type': 'application/json' },
    }).catch((error) => {
        if (error.message) {
            if (error.code >= 400 || error.code == 0) {
                if (error.message.length > 20) {
                    showDialog({
                        title: '系统提示',
                        allowHtml: true,
                        message: error.message,
                        theme: 'round-button',
                        confirmButtonText: '确 认'
                    }).then(() => {

                    })

                } else {
                    showNotify({
                        type: 'danger',
                        message: `${error.message}`
                    })
                }
                throw new Error(`${error.message}`)
            } else {
                showNotify({
                    type: 'danger',
                    message: `网络错误，请重试`
                })
                throw new Error(`${error.message}，详情：${error}`)
            }
        }
        else {
            if (error.code >= 400 || error.code == 0) {
                if (error.msg.length > 20) {
                    showDialog({
                        title: '系统提示',
                        allowHtml: true,
                        message: error.msg,
                        theme: 'round-button',
                        confirmButtonText: '确 认'
                    }).then(() => {

                    })

                } else {
                    showNotify({
                        type: 'danger',
                        message: `${error.msg}`
                    })
                }
                throw new Error(`${error.msg}`)
            } else {
                showNotify({
                    type: 'danger',
                    message: `网络错误，请重试`
                })
                throw new Error(`${error.msg}，详情：${error}`)
            }
        }
    })
}

export default {
    get(url, api, data, header) {
        return request({ url, api, data, header, method: 'GET' })
    },
    post(url, api, data, header) {
        return request({ url, api, data, header, method: 'POST' })
    },
    put(url, api, data, header) {
        return request({ url, api, data, header, method: 'PUT' })
    },
    delete(url, api, data, header) {
        return request({ url, api, data, header, method: 'DELETE' })
    }
}
