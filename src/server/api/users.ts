import Http from '@utils/http'

const { post, get } = new Http()

// 登录获取验证码
export const getVerify = async data => {
    return await post('dd/user/getVerify', data)
}
// 登录获取验证码图片
export const getImageVerifyCode = async data => {
    return await post('dd/user/getImageVerifyCode', data)
}
// 用户登录
export const userLogin = async data => {
    return await post('users/appletLogin', data)
}
// 获取用户信息
export const getCustomerInfo = data => {
    return get('userInfo', data)
}
// 获取余额
export const getAccount = data => {
    return get('userInfo/getAccount', data)
}
// 历史租车情况
export const getHistoryOrder = data => {
    return post('dd/user/getHistoryOrder', data)
}
// 获取历史租车包含价格
export const getHistoryOrderCost = data => {
    return post('dd/user/getHistoryOrderCost', data)
}
// 获取历史还车点数据
export const getHistoryReturnPosition = data => {
    return post('dd/user/getHistoryReturnPosition', data)
}
export const getHistoryOrderCus = data => {
    return get('history/order', data)
}
// 增加token跟phone的对应关系
export const addUserToken = data => {
    return post('userInfo/userToken/add', data)
}
// 编辑token
export const editUserToken = data => {
    return post('userInfo/userToken/edit', data)
}
// 扫描二维码登录后台
export const qrcodeLogin = data => {
    return post('users/qrcode/login', data)
}
// 花费
export const cost = data => {
    return get('userInfo/cost', data)
}
// 修改头像
export const editAvatar = data => {
    return post('userInfo/edit-avatar', data)
}
// 修改昵称
export const editNickname = data => {
    return post('userInfo/edit-nickname', data)
}
// 一键登录
export const fastLogin = data => {
    return post('users/fast-login', data)
}
