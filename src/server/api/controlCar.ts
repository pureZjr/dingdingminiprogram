import Http from '@utils/http'

const { post } = new Http()
// 控制车辆
export const controlCar = data => {
    return post('dd/CmdCtrl/controlCar', data)
}
//还车
export const returnCar = data => {
    return post('dd/CmdCtrl/returnCar', data)
}
