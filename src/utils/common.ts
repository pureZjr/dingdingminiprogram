import Taro from '@tarojs/taro'
import { getItem } from '@utils/localstorage'
import config from '../config'

// 获取当前位置
export const getLocation = () => {
    return new Promise<IUserStore.LOCATION>((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
        })
    })
}
// 检查token是否合法，否则跳转到登录页面
export const checkToken = async () => {
    const token = await getItem('token')
    if (!token) {
        Taro.redirectTo({
            url: '/container/pages/login/index',
        })
    }
    return !!token
}
// 获取屏幕中间位置
export const getMapContext = () => {
    return new Promise<wx.MapContext>(resolve => {
        const context = wx.createMapContext('myMap')
        resolve(context)
    })
}
// 地图路径
export const driving: (args: {
    takeStationLat: number
    takeStationLon: number
    destinationLat: number
    destinationLon: number
}) => Promise<{
    polyline: [
        {
            points: any[]
            color: string
            width: number
            arrowLine?: boolean
        }
    ]
}> = ({ takeStationLat, takeStationLon, destinationLat, destinationLon }) => {
    return new Promise(resolve => {
        // 网络请求设置
        const opt = {
            // WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
            url:
                'https://apis.map.qq.com/ws/direction/v1/driving/?from=' +
                takeStationLat +
                ',' +
                takeStationLon +
                '&to=' +
                destinationLat +
                ',' +
                destinationLon +
                '&key=' +
                config.mapKey,
            method: 'GET',
            dataType: 'json',
            // 请求成功回调
            success: res => {
                const ret = res.data
                if (ret.status !== 0) return // 服务异常处理
                const coors = ret.result.routes[0].polyline
                const pl = []
                // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
                const kr = 1000000
                for (let i = 2; i < coors.length; i++) {
                    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
                }
                // 将解压后的坐标放入点串数组pl中
                for (let i = 0; i < coors.length; i += 2) {
                    pl.push({ latitude: coors[i], longitude: coors[i + 1] })
                }
                // 设置polyline属性，将路线显示出来
                resolve({
                    polyline: [
                        {
                            points: pl,
                            color: '#1890ff',
                            width: 6,
                            arrowLine: true,
                        },
                    ],
                })
            },
        }
        /*global wx wx:true*/
        wx.request(opt)
    })
}
