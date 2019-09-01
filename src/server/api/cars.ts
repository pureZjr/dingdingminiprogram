import Http from '@utils/http'

const { post } = new Http()

// 获取附件站点信息
export const getAround = data => {
    return post('cars/around', data)
}
// 获取站点车辆
export const getStationCar = data => {
    return post('cars/getStationCar', data)
}
// 历史还车点
export const getHistoryReturnPosition = data => {
    return post('cars/getHistoryReturnPosition', data)
}
// 获取还车点限制信息
export const getLimit = data => {
    return post('cars/getLimit', data)
}
