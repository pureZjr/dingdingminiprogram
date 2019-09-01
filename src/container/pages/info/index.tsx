import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import { ComponentBENHelper } from '@utils/reactBemHelper'

const classes = ComponentBENHelper('info')

interface IStoresProps {
    UserStore: {
        userInfo: IUserStore.INFO
    }
}

@inject('UserStore')
@observer
export default class Info extends Component<IStoresProps> {
    config: Taro.Config = {
        navigationBarTitleText: '基础信息',
    }

    render() {
        const {
            driverLicenseBackImg,
            driverLicenseImg,
            idCardBackImg,
            idCardImg,
            area,
            sex,
            name,
            phone,
        } = this.props.UserStore.userInfo
        return (
            <View className={classes()}>
                <View className={classes('msg')}>
                    <Text className={classes('title')}>个人信息</Text>
                    <View className={classes('item')}>
                        <Text className={classes('label')}>姓名：</Text>
                        <Text className={classes('value')}>{name}</Text>
                    </View>
                    <View className={classes('item')}>
                        <Text className={classes('label')}>性别：</Text>
                        <Text className={classes('value')}>
                            {Number(sex) === 2 ? '男' : '女'}
                        </Text>
                    </View>
                    <View className={classes('item')}>
                        <Text className={classes('label')}>手机号码：</Text>
                        <Text className={classes('value')}>{phone}</Text>
                    </View>
                    <View className={classes('item')}>
                        <Text className={classes('label')}>住址：</Text>
                        <Text className={classes('value')}>{area}</Text>
                    </View>
                </View>
                <View className={classes('cart')}>
                    <Text className={classes('title')}>证件</Text>
                    <Image className={classes('img')} src={driverLicenseImg} />
                    <Image
                        className={classes('img')}
                        src={driverLicenseBackImg}
                    />
                    <Image className={classes('img')} src={idCardImg} />
                    <Image className={classes('img')} src={idCardBackImg} />
                </View>
            </View>
        )
    }
}
