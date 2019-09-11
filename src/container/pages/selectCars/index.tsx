import Taro, { Component } from '@tarojs/taro'
import { AtTabs, AtTabsPane, AtMessage } from 'taro-ui'
import { View, ScrollView, Button, Image, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import '@tarojs/async-await'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { getStationCar } from '@server/api/cars'
import CarListItem from './carListItem'
import './index.scss'

const classes = ComponentBENHelper('select-cars')

const tabList = [
    { title: '知豆' },
    { title: '北汽' },
    { title: '俊风' },
    { title: '众泰' },
]

interface IProps {}
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
interface IState {
    current: number
    zhidou: ICarsListItem[]
    beiqi: ICarsListItem[]
    junfeng: ICarsListItem[]
    zongtai: ICarsListItem[]
    currentCarId: string
    containerHeight: number
}
export interface ICarsListItem {
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

@inject('UserStore')
@observer
export default class SelectCars extends Component<
    IProps & IStoresProps,
    IState
> {
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
            currentCarId: '',
            zhidou: [],
            beiqi: [],
            junfeng: [],
            zongtai: [],
            containerHeight: 0,
        }
    }

    config: Taro.Config = {
        navigationBarTitleText: '车辆列表',
    }

    // 获取车辆
    getCars = async (stationId: number) => {
        const res = (await getStationCar({
            stationId,
            seat: '0',
        })) as ICarsListItem[]
        const zhidou =
            res instanceof Array ? res.filter(v => v.brand === '知豆') : []
        const beiqi =
            res instanceof Array ? res.filter(v => v.brand === '北汽') : []
        const junfeng =
            res instanceof Array ? res.filter(v => v.brand === '俊风') : []
        const zongtai =
            res instanceof Array ? res.filter(v => v.brand === '众泰') : []
        this.setState({
            zhidou,
            beiqi,
            junfeng,
            zongtai,
        })
    }
    // 切换tab
    handleChangeTab = (current: number) => {
        this.setState({
            current,
        })
    }
    onSelectCar = (id: string) => {
        this.setState({
            currentCarId: id,
        })
    }

    componentDidMount() {
        let query = Taro.createSelectorQuery()
        query.select('#tabs-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setState({
                containerHeight: res[0].height - 160,
            })
        })
        this.getCars(this.$router.params.id)
    }

    oonbacn = () => {
        Taro.navigateBack({
            delta: Taro.getCurrentPages().length - 1,
        })
    }

    renderCarList = (list: ICarsListItem[]) => {
        const { containerHeight, currentCarId } = this.state
        return (
            <ScrollView
                scrollY
                style={{
                    paddingTop: '12px',
                    height: `${containerHeight}px`,
                }}
            >
                {list.map(v => (
                    <CarListItem
                        key={v.id}
                        item={v}
                        currentCarId={currentCarId}
                        onClick={this.onSelectCar}
                    />
                ))}
            </ScrollView>
        )
    }

    renkCar = () => {
        Taro.atMessage({
            message: '功能开发中',
            type: 'success',
        })
    }

    renderNoCarList = () => {
        const { containerHeight } = this.state
        return (
            <View
                className={classes('no-data')}
                style={{
                    paddingTop: '12px',
                    height: `${containerHeight}px`,
                }}
            >
                <Image
                    style={{
                        height: '84px',
                        width: '84px',
                    }}
                    src={require('@assets/no-car-list.png')}
                />
                <Text className={classes('no-data-text')}>没有可选车辆</Text>
            </View>
        )
    }

    render() {
        const { zhidou, beiqi, junfeng, zongtai } = this.state
        return (
            <View className={classes()}>
                <View className={classes('tabs-container')} id="tabs-container">
                    <AtTabs
                        current={this.state.current}
                        tabList={tabList}
                        onClick={this.handleChangeTab}
                        className={classes('tabs')}
                        customStyle={{
                            background: '#fff',
                        }}
                    >
                        <AtTabsPane current={this.state.current} index={0}>
                            {!!zhidou.length
                                ? this.renderCarList(zhidou)
                                : this.renderNoCarList()}
                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={1}>
                            {!!beiqi.length
                                ? this.renderCarList(beiqi)
                                : this.renderNoCarList()}
                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={2}>
                            {!!junfeng.length
                                ? this.renderCarList(junfeng)
                                : this.renderNoCarList()}
                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={3}>
                            {!!zongtai.length
                                ? this.renderCarList(zongtai)
                                : this.renderNoCarList()}
                        </AtTabsPane>
                    </AtTabs>
                </View>
                <View className={classes('rank-car')}>
                    <Button
                        className={classes('rank-car-text')}
                        disabled={!this.state.currentCarId}
                        onClick={this.renkCar}
                    >
                        马上租车
                    </Button>
                </View>
                <AtMessage />
            </View>
        )
    }
}
