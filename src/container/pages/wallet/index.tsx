import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text } from '@tarojs/components'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { getAccount } from '@server/api/users'

const classes = ComponentBENHelper('wallet')

interface IWallet {
    totalAmount: number // 余额
    vehicleDeposit: number // 车辆押金
    violationDeposit: number // 违章押金
}
interface IState {
    wallet: IWallet
}

export default class Wallet extends Component<any, IState> {
    constructor(props) {
        super(props)
        this.state = {
            wallet: {
                totalAmount: 0,
                vehicleDeposit: 0,
                violationDeposit: 0,
            },
        }
    }

    config: Taro.Config = {
        navigationBarTitleText: '钱包',
    }

    getUserAccount = async () => {
        const res: IWallet = await getAccount({})
        this.setState({
            wallet: res,
        })
    }

    componentDidMount() {
        this.getUserAccount()
    }

    render() {
        const {
            totalAmount,
            vehicleDeposit,
            violationDeposit,
        } = this.state.wallet
        return (
            <View className={classes('')}>
                <View className={classes('item')}>
                    <Text className={classes('label')}>车辆押金</Text>
                    <Text className={classes('value')}>￥{vehicleDeposit}</Text>
                </View>
                <View className={classes('item')}>
                    <Text className={classes('label')}>违章押金</Text>
                    <Text className={classes('value')}>
                        ￥{violationDeposit}
                    </Text>
                </View>
                <View className={classes('item')}>
                    <Text className={classes('label')}>余额</Text>
                    <Text className={classes('value')}>￥{totalAmount}</Text>
                </View>
            </View>
        )
    }
}
