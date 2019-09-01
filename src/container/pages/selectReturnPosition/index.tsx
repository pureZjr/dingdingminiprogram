import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import {
    AtMessage,
    AtModal,
    AtModalHeader,
    AtModalContent,
    AtModalAction,
    AtSearchBar,
} from 'taro-ui'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { getHistoryReturnPosition, getLimit, getAround } from '@server/api/cars'
import QQMapWX from '@components/Map/qqmap-wx-jssdk.min.js'
import './index.scss'

const classes = ComponentBENHelper('select-return-position')

interface ReturePositionItem {
    area: string // 区域
    availablePort: number // 剩余车位
    district: string
    districtName: string
    id: string
    location: string
    low?: number
    row?: number
    stationName?: string
    status?: string
    name?: string
}
interface SearchValue {
    id: string
    address: string
    title: string
    location: {
        lat: number
        lng: number
    }
}
interface IStoresProps {
    UserStore: {
        setReturnPositionProps: (id: string, stationName: string) => void
    }
}

interface IState {
    returePositionList: ReturePositionItem[]
    getPositionId: string
    modalVisible: boolean
    returnPositionProps: {
        id: string
        stationName: string
    }
    qqmapsdk: any
    keyword: string
    searchValue: SearchValue[]
    searchReturePositionList: ReturePositionItem[]
    containerHeight: number
    isSearching: boolean
}

@inject('UserStore')
@observer
export default class SelectReturnPosition extends Component<
    IStoresProps,
    IState
> {
    config: Taro.Config = {
        navigationBarTitleText: '还车点列表',
    }
    constructor(props) {
        super(props)
        this.state = {
            returePositionList: [],
            getPositionId: '',
            modalVisible: false,
            returnPositionProps: {
                id: '',
                stationName: '',
            },
            qqmapsdk: null,
            keyword: '',
            searchValue: [],
            searchReturePositionList: [],
            containerHeight: 0,
            isSearching: false,
        }
    }

    getHistoryReturnPosition = async () => {
        const res = (await getHistoryReturnPosition({})) as ReturePositionItem[]
        this.setState({
            returePositionList: res,
        })
    }
    onSelectReturnPosition = (id: string, stationName: string) => {
        const data = {
            type: 'return',
            stationId: id,
            oppositeStationId: this.state.getPositionId, // 取车点id
        }
        this.setState({
            returnPositionProps: {
                id,
                stationName,
            },
        })
        getLimit(data).then((res: { portFlag: string; portInfo: string }) => {
            if (res.portFlag === '2') {
                // 车位已满，并且不能给调度费
                return this.showMessage('warning', res.portInfo)
            } else if (res.portFlag === '1') {
                // 车位已满，能给调度费
                this.setState({
                    modalVisible: true,
                })
            } else {
                this.props.UserStore.setReturnPositionProps(id, stationName)
                Taro.navigateBack({
                    delta: Taro.getCurrentPages().length - 1,
                })
            }
        })
    }
    showMessage = (type, info) => {
        Taro.atMessage({
            message: info,
            type: type,
        })
    }
    onConfirm = () => {
        const { id, stationName } = this.state.returnPositionProps
        this.props.UserStore.setReturnPositionProps(id, stationName)
        Taro.navigateBack({
            delta: Taro.getCurrentPages().length - 1,
        })
    }
    initQQMap = () => {
        const qqmapsdk = new QQMapWX({
            key: '6K3BZ-2CEWO-L6HWT-SY4UP-2K6HT-JMBB4',
        })
        this.setState({
            qqmapsdk,
        })
    }
    onKeywordChange = (keyword: string) => {
        this.setState({
            keyword,
        })
        if (!keyword) {
            this.setState({
                searchValue: [],
                searchReturePositionList: [],
                isSearching: false,
            })
        }
    }
    onSearch = () => {
        this.state.qqmapsdk.search({
            keyword: this.state.keyword,
            success: res => {
                this.setState({
                    searchValue: res.data.slice(0, 5),
                    isSearching: true,
                })
            },
            fail: function(res) {
                console.log(res)
            },
        })
    }
    // 获取附近还车点
    getAround = async (args: { lat: number; lon: number }) => {
        const data = {
            lat: args.lat,
            lon: args.lon,
            radius: 3000,
        }
        const res: IHome.AroundInfo[] = await getAround(data)
        this.setState({
            searchReturePositionList: res,
            isSearching: false,
        })
    }

    componentDidMount() {
        let query = Taro.createSelectorQuery()
        query.select('#container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setState({
                containerHeight: res[0].height - 48,
            })
        })
        this.setState({
            getPositionId: this.$router.params.id,
            modalVisible: false,
        })
        this.getHistoryReturnPosition()
        this.initQQMap()
    }

    render() {
        const {
            searchReturePositionList,
            returePositionList,
            containerHeight,
            searchValue,
            modalVisible,
            isSearching,
        } = this.state
        return (
            <View className={classes('')} id="container">
                <AtMessage />
                <AtModal isOpened={modalVisible}>
                    <AtModalHeader>提示</AtModalHeader>
                    <AtModalContent>
                        该站点车位已满,是否支付5元继续停放！ (仅限于分时租赁)
                    </AtModalContent>
                    <AtModalAction>
                        <Button
                            onClick={() =>
                                this.setState({
                                    modalVisible: false,
                                })
                            }
                        >
                            取消
                        </Button>
                        <Button onClick={this.onConfirm}>确定</Button>
                    </AtModalAction>
                </AtModal>
                <View className={classes('search')}>
                    <AtSearchBar
                        className={classes('seacrh-bar')}
                        showActionButton={false}
                        value={this.state.keyword}
                        onChange={this.onKeywordChange}
                        onActionClick={this.onSearch}
                    />
                    <View
                        className={classes(
                            'value-box',
                            `${isSearching ? 'show' : 'hide'}`
                        )}
                    >
                        {searchValue.map(v => {
                            return (
                                <View
                                    className={classes('value-box-item')}
                                    key={v.id}
                                    onClick={() =>
                                        this.getAround({
                                            lat: v.location.lat,
                                            lon: v.location.lng,
                                        })
                                    }
                                >
                                    <View className={classes('title')}>
                                        {v.title}
                                    </View>
                                    <View className={classes('address')}>
                                        {v.address}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <ScrollView scrollY style={{ height: `${containerHeight}px` }}>
                    {(!!searchReturePositionList.length
                        ? searchReturePositionList
                        : returePositionList
                    ).map(v => {
                        return (
                            <View
                                key={v.id}
                                className={classes('item')}
                                onClick={() =>
                                    this.onSelectReturnPosition(
                                        v.id,
                                        v.stationName || v.name
                                    )
                                }
                            >
                                <View className={classes('area')}>
                                    {v.districtName}
                                </View>
                                <View className={classes('position')}>
                                    <Text className={classes('station-name')}>
                                        {v.stationName || v.name}
                                    </Text>
                                    <Text className={classes('location')}>
                                        {v.location}
                                    </Text>
                                </View>
                                <View className={classes('port-nums')}>
                                    <View className={classes('p')}>P</View>x
                                    <View>
                                        {v.availablePort > 99
                                            ? 99
                                            : v.availablePort}
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}
