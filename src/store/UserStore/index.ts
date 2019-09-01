import { observable, action } from 'mobx'

export class UserStore {
    /**
     * 用户信息
     */
    @observable
    userInfo: IUserStore.INFO = {
        area: '',
        consumerPoints: '',
        creditPoint: 0,
        currentCleanTaskId: '',
        currentOrderId: '',
        currentSpecialApptId: '',
        currentTaskId: '',
        dispatcherRole: '',
        driverLicenseBackImg: '',
        driverLicenseExpirationDate: '',
        driverLicenseImg: '',
        idCard: '',
        idCardBackImg: '',
        idCardImg: '',
        img: '',
        insurance: 0,
        isInside: '',
        level: '',
        licenseNo: '',
        licenseStartDate: '',
        licenseSubmitTime: '',
        licenseType: '',
        monthTotal: '',
        name: '',
        niceName: '',
        organId: '',
        organName: '',
        organPermission: '',
        phone: '',
        reviewStatus: '',
        sex: '',
        userStatus: '', // 1: 租车状态
    }
    @observable
    returnPositionProps: {
        id: string
        name: string
    } = {
        name: '',
        id: '',
    }
    @observable
    location: IUserStore.LOCATION = null

    @action
    setUserInfo = (info: IUserStore.INFO) => {
        this.userInfo = { ...this.userInfo, ...info }
    }
    @action
    setReturnPositionProps = (id: string, stationName: string) => {
        this.returnPositionProps = {
            name: stationName,
            id,
        }
    }
    @action
    setLocation = (args: IUserStore.LOCATION) => {
        this.location = args
    }
}

export default new UserStore()
