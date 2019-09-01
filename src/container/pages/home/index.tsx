import Taro, { Component } from '@tarojs/taro'
import { View, Map, CoverImage, CoverView } from '@tarojs/components'
import '@tarojs/async-await'
import { marker as TaroMarker } from '@tarojs/components/types/Map'
import { observer, inject } from '@tarojs/mobx'
import { AtMessage } from 'taro-ui'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { getAround } from '@server/api/cars'
import { getLocation, getMapContext, driving } from '@utils/common'
import Suspension from './suspension'
import './index.scss'

const classes = ComponentBENHelper('home')

interface IStoresProps {
    UserStore: {
        userInfo: IUserStore.INFO
        returnPositionProps: {
            id: string
            name: string
        }
        setUserInfo: (userInfo: IUserStore.INFO) => void
        setLocation: (args: IUserStore.LOCATION) => void
        location: IUserStore.LOCATION
    }
}
interface IState {
    currentLat: number
    currentLon: number
    lastLat: number
    lastLon: number
    markers: TaroMarker[]
    getPositionProps: {
        id: string
        name: string
        availableVehicle: number
    }
    polyline: {
        points: { latitude: number; longitude: number }[]
        color: string
        width: number
        arrowLine?: boolean
    }[]
}

@inject('UserStore')
@observer
export default class Home extends Component<IStoresProps, IState> {
    config: Taro.Config = {
        navigationBarTitleText: '主页',
    }

    constructor(props) {
        super(props)
        this.state = {
            currentLat: 0,
            currentLon: 0,
            lastLat: 0,
            lastLon: 0,
            markers: [],
            getPositionProps: {
                name: '',
                id: '0',
                availableVehicle: 0,
            },
            polyline: [
                {
                    points: [],
                    color: '#FF0000DD',
                    width: 4,
                    arrowLine: true,
                },
            ],
        }
    }

    // 创建地图的maker
    reateMaker = (res: IHome.AroundInfo[]) => {
        const markers: TaroMarker[] = res.map(v => ({
            id: v.id,
            latitude: v.lat,
            longitude: v.lon,
            title: v.name,
            area: v.area,
            iconPath: `${
                v.availableVehicle > 0
                    ? require('@assets/cars.png')
                    : require('@assets/no-cars.png')
            }`,
            height: 35,
            width: 35,
            anchor: { x: 0.5, y: 1 },
            zIndex: 1,
            callout: {
                borderRadius: 5,
                borderColor: '#ccc',
                padding: 5,
                content: `${v.name}`,
                color: '#fff',
                fontSize: 10,
                borderWidth: 1,
                bgColor: '#000',
                textAlign: 'center',
                display: 'BYCLICK',
            },
            availableVehicle: v.availableVehicle,
        }))
        return markers
    }
    // 获取附近车辆
    getAround = async (param: { latitude: number; longitude: number }) => {
        const data = {
            lat: param.latitude,
            lon: param.longitude,
            radius: 2000,
        }
        const res: IHome.AroundInfo[] = await getAround(data)
        try {
            const markers = this.reateMaker(res)
            // 设置默认的取车点
            const availableVehicleIndex = res.findIndex(
                v => v.availableVehicle > 0
            )
            this.setState({
                markers,
            })
            this.onHandleSelectPosition({
                markerId: res[availableVehicleIndex].id,
                markers,
            })
        } catch (err) {
            this.setState({
                markers: [],
            })
            this.onHandleSelectPosition({
                markerId: '0',
                markers: [],
            })
        }
    }
    // 选择站点
    onHandleSelectPosition = async (e: {
        markers: any[]
        markerId: string
    }) => {
        const { currentLat, currentLon } = this.state
        this.setState({
            polyline: [],
        })
        if (!currentLat || !currentLon) {
            return false
        }
        const currentStation = e.markers.filter(v => v.id === e.markerId)
        if (
            !!currentStation.length &&
            currentStation[0].availableVehicle === 0
        ) {
            return Taro.atMessage({
                message: '该站点没有可用车辆，请选择其他站点',
                type: 'warning',
            })
        }
        this.setState({
            getPositionProps: {
                id: e.markerId,
                name:
                    currentStation instanceof Array && !!currentStation.length
                        ? currentStation[0].title
                        : '',
                availableVehicle:
                    currentStation instanceof Array && !!currentStation.length
                        ? currentStation[0].availableVehicle
                        : 0,
            },
        })
        const statsionIndex = e.markers.findIndex(v => v.id === e.markerId)
        if (!e.markers[statsionIndex]) {
            return
        }
        const { latitude, longitude } = e.markers[statsionIndex]
        const polyline = await driving({
            takeStationLat: currentLat,
            takeStationLon: currentLon,
            destinationLat: latitude,
            destinationLon: longitude,
        })
        this.setState(polyline)
    }
    // 地图改变出发触发
    onRegionChange = async ({ type }) => {
        const mapContext = await getMapContext()
        if (type === 'begin') {
            mapContext.getCenterLocation({
                success: res => {
                    this.setState({
                        lastLat: res.latitude,
                        lastLon: res.longitude,
                    })
                },
            })
        }
        if (type === 'end') {
            mapContext.getCenterLocation({
                success: res => {
                    const { lastLat, lastLon } = this.state
                    const lat_distance = res.latitude - lastLat
                    const lon_distance = res.longitude - lastLon
                    if (!lastLat || !lastLon) {
                        return false
                    }
                    if (
                        Math.abs(lon_distance) >= 0.0085 ||
                        Math.abs(lat_distance) >= 0.0085
                    ) {
                        this.getAround(res)
                    }
                },
            })
        }
    }
    // 跳转用户信息页面
    toUserInfo = () => {
        Taro.navigateTo({
            url: '/container/pages/userInfo/index',
        })
    }
    // 回到当前定位
    backToLocation = async () => {
        const mapContext = await getMapContext()
        mapContext.moveToLocation()
    }

    async componentDidMount() {
        const args = await getLocation()
        this.props.UserStore.setLocation(args)
        this.setState({
            currentLat: args.latitude,
            currentLon: args.longitude,
        })
        await this.getAround({
            latitude: args.latitude,
            longitude: args.longitude,
        })
    }

    render() {
        const {
            currentLat,
            currentLon,
            markers,
            getPositionProps,
            polyline,
        } = this.state
        if (!this.props.UserStore.userInfo) {
            return null
        }
        const { returnPositionProps } = this.props.UserStore
        return (
            <View className={classes()}>
                <Map
                    id="myMap"
                    className={classes('map')}
                    longitude={currentLon}
                    latitude={currentLat}
                    markers={markers}
                    onMarkerTap={(e: any) =>
                        this.onHandleSelectPosition({
                            markers: this.state.markers,
                            markerId: e.markerId,
                        })
                    }
                    polyline={polyline}
                    showLocation
                    onRegionChange={this.onRegionChange}
                    scale={15}
                    show-scale
                    enable-satellite={false}
                    enable-traffic
                >
                    <CoverView
                        style={{
                            position: 'absolute',
                            top: '48%',
                            left: '48%',
                        }}
                    >
                        <CoverImage
                            src={require('@assets/home/place.png')}
                            style={{
                                width: '32px',
                                height: '32px',
                            }}
                        />
                    </CoverView>
                    <CoverView
                        className={classes('icon-box')}
                        style={{
                            bottom: '440rpx',
                        }}
                        onClick={() => {
                            this.toUserInfo()
                        }}
                    >
                        <CoverImage
                            className={classes('icon')}
                            src={require('@assets/home/user.png')}
                        />
                    </CoverView>
                    <CoverView
                        className={classes('icon-box')}
                        style={{
                            bottom: '350rpx',
                        }}
                        onClick={() => {
                            this.backToLocation()
                        }}
                    >
                        <CoverImage
                            className={classes('icon')}
                            src={require('@assets/home/location.png')}
                        />
                    </CoverView>
                    <Suspension
                        returnPositionProps={returnPositionProps}
                        getPositionProps={getPositionProps}
                        hasOrder={
                            !!this.props.UserStore.userInfo.currentOrderId
                        }
                    />
                </Map>
                <AtMessage />
            </View>
        )
    }
}
