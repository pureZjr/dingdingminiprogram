import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { AtMessage } from 'taro-ui'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { qrcodeLogin, editAvatar, getCustomerInfo } from '@server/api/users'
import { setItem } from '@utils/localstorage'
import { checkToken } from '@utils/common'
import './index.scss'

const classes = ComponentBENHelper('user-info')

interface IStoresProps {
    UserStore: {
        userInfo: IUserStore.INFO
        returnPositionProps: {
            id: number
            name: string
        }
        setUserInfo: (userInfo: IUserStore.INFO) => void
    }
}
@inject('UserStore')
@observer
export default class UserInfo extends Component<IStoresProps> {
    config: Taro.Config = {
        navigationBarTitleText: '我的',
    }

    //月度账单
    onGetMonthlyOrder = () => {
        Taro.navigateTo({ url: '/container/pages/orderHistory/index' })
    }
    // 钱包
    toWallet = () => {
        Taro.navigateTo({ url: '/container/pages/wallet/index' })
    }
    // 个人信息
    toInfo = () => {
        Taro.navigateTo({ url: '/container/pages/info/index' })
    }
    // 扫码登录管理后台
    scan = () => {
        /*global wx wx:true*/
        wx.scanCode({
            onlyFromCamera: true,
            success: async res => {
                const data = {
                    uuid: res.result,
                    phone: this.props.UserStore.userInfo.phone,
                }
                const resqr = await qrcodeLogin(data)
                if (resqr.message) {
                    Taro.atMessage({
                        message: resqr.message,
                        type: 'success',
                    })
                } else {
                    Taro.atMessage({
                        message: '扫码失败',
                        type: 'error',
                    })
                }
            },
        })
    }
    // 修改头像
    changeAvatar = () => {
        wx.chooseImage({
            count: 1,
            success: ({ tempFilePaths }) => {
                editAvatar({
                    urlPath: tempFilePaths[0],
                }).then(() => {
                    this.props.UserStore.setUserInfo({
                        img: tempFilePaths[0],
                    })
                    Taro.atMessage({
                        message: '修改成功',
                        type: 'success',
                    })
                })
            },
            fail: () => {
                Taro.atMessage({
                    message: '修改失败',
                    type: 'error',
                })
            },
        })
    }
    // 预览大图
    preViewImg = () => {
        const { img } = this.props.UserStore.userInfo
        wx.previewImage({
            current: img,
            urls: [img],
        })
    }
    // 加载头像失败
    loadAvatarErr = () => {
        this.props.UserStore.setUserInfo({
            img: 'http://ss.purevivi.art/no-cars.png',
        })
    }
    // 修改名字
    editName = () => {
        const { niceName } = this.props.UserStore.userInfo
        Taro.navigateTo({
            url: `/container/pages/editName/index?name=${niceName}`,
        })
    }
    // 登出
    logout = () => {
        Taro.showModal({
            title: '注销',
            content: '确定注销？',
        }).then(res => {
            if (res.confirm) {
                setItem('token', '')
                Taro.navigateTo({
                    url: '/container/pages/login/index',
                })
            }
        })
    }

    async componentDidShow() {
        if (!this.props.UserStore.userInfo.phone) {
            const userInfo = await getCustomerInfo({})
            this.props.UserStore.setUserInfo(userInfo)
        }
    }

    async componentWillMount() {
        await checkToken()
    }

    render() {
        const { img, niceName } = this.props.UserStore.userInfo
        return (
            <View className={classes('')}>
                <View className={classes('header')}>
                    <View className={classes('left')}>
                        <View
                            className={classes('avatar')}
                            onClick={this.preViewImg}
                            style={{
                                backgroundImage: `url(${img})`,
                            }}
                        />
                        <View
                            className={classes('camera')}
                            onClick={this.changeAvatar}
                        >
                            <Image
                                className={classes('camera-img')}
                                src={require('@assets/userInfo/camera.png')}
                            />
                        </View>
                    </View>
                    <View className={classes('right')}>
                        <Text className={classes('nick')}>{niceName}</Text>
                        <Image
                            src={require('@assets/userInfo/edit.png')}
                            className={classes('edit')}
                            onClick={this.editName}
                        />
                    </View>
                </View>
                <View className={classes('base-info')}>
                    <Image
                        src={require('@assets/userInfo/userInfo.png')}
                        className={classes('img')}
                    />
                    <View
                        className={classes('item-container')}
                        onClick={this.toInfo}
                    >
                        <Text className={classes('item-name')}>基础信息</Text>
                        <Image
                            src={require('@assets/userInfo/right.png')}
                            className={classes('img')}
                        />
                    </View>
                </View>
                <View className={classes('month-account')}>
                    <Image
                        src={require('@assets/userInfo/pay.png')}
                        className={classes('img')}
                    />
                    <View
                        className={classes('item-container')}
                        onClick={this.onGetMonthlyOrder}
                    >
                        <Text className={classes('item-name')}> 月度账单</Text>
                        <Image
                            src={require('@assets/userInfo/right.png')}
                            className={classes('img')}
                        />
                    </View>
                </View>
                <View className={classes('wallet')} onClick={this.toWallet}>
                    <Image
                        src={require('@assets/userInfo/wallet.png')}
                        className={classes('img')}
                    />
                    <View className={classes('item-container')}>
                        <Text className={classes('item-name')}> 钱包</Text>
                        <Image
                            src={require('@assets/userInfo/right.png')}
                            className={classes('img')}
                        />
                    </View>
                </View>
                <View className={classes('scan-login')} onClick={this.scan}>
                    <Image
                        src={require('@assets/userInfo/scan.png')}
                        className={classes('img')}
                    />
                    <View className={classes('item-container')}>
                        <Text className={classes('item-name')}>扫码登录</Text>
                    </View>
                </View>
                <View className={classes('logout')} onClick={this.logout}>
                    <Image
                        src={require('@assets/userInfo/logout.png')}
                        className={classes('img')}
                    />
                    <View className={classes('item-container')}>
                        <Text className={classes('item-name')}>注销</Text>
                    </View>
                </View>
                <AtMessage />
            </View>
        )
    }
}
