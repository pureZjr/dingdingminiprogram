import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text } from '@tarojs/components'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import './index.scss'

const classes = ComponentBENHelper('order')

interface IProps {}

export default class Order extends Component<IProps> {
    config: Taro.Config = {
        navigationBarTitleText: 'Order',
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        return (
            <View className={classes('order')}>
                <Text>Order</Text>
            </View>
        )
    }
}
