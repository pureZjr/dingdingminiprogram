import Http from '@utils/http'

const { post } = new Http()
// 租车信息
export const getCarInfo = data => {
    return post('dd/orderInfo/getCarInfo', data)
}
