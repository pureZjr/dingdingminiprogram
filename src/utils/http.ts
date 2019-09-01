import Taro from '@tarojs/taro'
import '@tarojs/async-await'

import { getItem } from './localstorage'
import config from '../config'

type HttpMethods = 'GET' | 'POST'

const ContentType = 'application/x-www-form-urlencoded'
const baseUrl = config.baseUrl

export default class Http {
    get = (url: string, data: Object): Promise<any> | any => {
        return this.HandleHttp('GET', url, data)
    }
    post = (url: string, data: {}): Promise<any> | any => {
        return this.HandleHttp('POST', url, data)
    }

    HandleHttp = async (method: HttpMethods, u: string, data: Object) => {
        return new Promise(async (resolve, reject) => {
            const token = await getItem('token')
            if (!!token) {
                data['token'] = token
            }
            const url = baseUrl + u
            Taro.showLoading({
                title: '加载中...',
                mask: true,
            })
            try {
                const res = await Taro.request({
                    url,
                    method,
                    data: { ...data },
                    header: {
                        'content-type': ContentType,
                    },
                })
                Taro.hideLoading()
                // status 1: 请求成功；2: 没权限
                switch (res.statusCode) {
                    case 200:
                        if (res.data.status === 1) {
                            resolve(res.data.data)
                        } else if (res.data.status === 2) {
                            Taro.redirectTo({
                                url: '/container/pages/login/index',
                            })
                        } else {
                            resolve(null)
                        }
                        break
                    case 401:
                        Taro.redirectTo({
                            url: '/container/pages/login/index',
                        })
                        break
                    default:
                        reject(new Error(res.data.message))
                }
            } catch (err) {
                Taro.hideNavigationBarLoading()
                reject(new Error('请求出错'))
            }
        })
    }
}
