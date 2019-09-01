import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtProgress } from 'taro-ui'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import './index.scss'

interface ICarsListItem {
    brand: string
    carNum: string
    color: string
    cruisingDistance: number
    dailyDistance: number
    dailyPrice: number
    distanceUnitPrice: number
    durationUnitPrice: number
    id: string
    insurance: number
    power: number
    prefPriceUrl: string
    rentDays: number
    seat: number
    typeIco: string
    typeId: string
    typeName: string
}

interface IProps {
    item: ICarsListItem
    currentCarId: string
    onClick: (id: string) => void
}

const classes = ComponentBENHelper('car-list-item')

export default class CarListItem extends Component<IProps> {
    render() {
        if (!this.props.item) {
            return
        }
        const {
            typeIco,
            typeName,
            distanceUnitPrice,
            durationUnitPrice,
            power,
            carNum,
            color,
            id,
        } = this.props.item
        return (
            <View
                className={classes(
                    '',
                    `${this.props.currentCarId === id ? 'active' : ''}`
                )}
                onClick={() => this.props.onClick(id)}
            >
                <AtAvatar
                    className={classes('avatar')}
                    image={typeIco}
                    circle
                />
                <View className={classes('tips')}>
                    <View>{typeName}</View>
                    <View>{`￥${distanceUnitPrice}/km`}</View>
                    <View>{`￥${durationUnitPrice}/min`}</View>
                </View>
                <View className={classes('progress')}>
                    <View className={classes('power')}>{power}</View>
                    <AtProgress percent={power} isHidePercent />
                </View>
                <View className={classes('num')}>
                    <View>{carNum}</View>
                    <View>({color})</View>
                </View>
            </View>
        )
    }
}
