import Taro, { Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import '@tarojs/async-await'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { cost } from '@server/api/users'
import './index.scss'

const classes = ComponentBENHelper('order-history')

interface IProps {}

interface IStates {
    data: { date: string; cost: number; reallyCost: number }[]
}

export default class OrderHistory extends Component<IProps, IStates> {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    config: Taro.Config = {
        navigationBarTitleText: '月结账单',
    }

    // 获取花费
    getCost = async () => {
        const res = await cost({})

        this.setState({
            data: res,
        })
    }

    componentDidMount() {
        this.getCost()
    }

    render() {
        const { data } = this.state
        return (
            <ScrollView className={classes()} scrollY>
                {data.map(v => {
                    const key = Object.keys(v)[0]
                    return (
                        <AtCard
                            key={key}
                            title={key}
                            className={classes('card')}
                        >
                            车费：￥{Math.ceil(v[key])}
                        </AtCard>
                    )
                })}
            </ScrollView>
        )
    }
}
