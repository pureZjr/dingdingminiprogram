import { UserStore as UserStoreModel } from './index'

export as namespace IUserStore

export interface UserStore extends UserStoreModel {}

export interface INFO {
    area?: string
    consumerPoints?: string
    creditPoint?: number
    currentCleanTaskId?: string
    currentOrderId?: string // 当前订单号
    currentSpecialApptId?: string
    currentTaskId?: string
    dispatcherRole?: string
    driverLicenseBackImg?: string
    driverLicenseExpirationDate?: string
    driverLicenseImg?: string
    idCard?: string
    idCardBackImg?: string
    idCardImg?: string
    img?: string
    insurance?: number
    isInside?: string
    level?: string
    licenseNo?: string
    licenseStartDate?: string
    licenseSubmitTime?: string
    licenseType?: string
    monthTotal?: string
    name?: string
    niceName?: string
    organId?: string
    organName?: string
    organPermission?: string
    phone?: string
    reviewStatus?: string
    sex?: string
    userStatus?: string // 1: 租车状态
}
export interface LOCATION {
    latitude: number
    longitude: number
}
