import Taro from '@tarojs/taro'
import { CoverView } from '@tarojs/components'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { checkToken } from '@utils/common'
import './suspension.scss'

const classes = ComponentBENHelper('suspension')

interface IProps {
    hasOrder: boolean
    getPositionProps: {
        id: string
        name: string
        availableVehicle: number
    }
    returnPositionProps: {
        id: string
        name: string
    }
}

function Suspension(props: IProps) {
    if (!props.getPositionProps) {
        return null
    }
    const { getPositionProps, returnPositionProps } = props
    const rankCarHidden = !props.returnPositionProps.id || !getPositionProps.id

    // 跳转到控制页面
    const onToControlCar = () => {
        Taro.navigateTo({
            url: '/container/pages/order/index',
        })
    }
    // 选择还车点
    const onHandleReturePosition = async () => {
        await checkToken()
        Taro.navigateTo({
            url: `/container/pages/selectReturnPosition/index?id=${
                props.getPositionProps.id
            }`,
        })
    }
    // 选择车辆
    const onSelectCars = () => {
        Taro.navigateTo({
            url: `/container/pages/selectCars/index?id=${
                props.getPositionProps.id
            }`,
        })
    }

    return props.hasOrder ? (
        <CoverView className={classes('control-car')}>
            <CoverView
                className={classes('control-car-btn')}
                onClick={onToControlCar}
            >
                控制车辆
            </CoverView>
        </CoverView>
    ) : (
        <CoverView className={classes('car-input-container')}>
            <CoverView className={classes('car-input')}>
                <CoverView className={classes('point', 'get')} />
                <CoverView className={classes('input')}>
                    <CoverView>
                        {getPositionProps.name || '附件暂无可用站点'}
                    </CoverView>
                </CoverView>
                {!!getPositionProps.name && (
                    <CoverView className={classes('available-vehicle')}>
                        <CoverView>
                            {getPositionProps.availableVehicle}
                        </CoverView>
                    </CoverView>
                )}
            </CoverView>
            <CoverView className={classes('car-input')}>
                <CoverView className={classes('point', 'return')} />
                <CoverView
                    className={classes('input')}
                    onClick={onHandleReturePosition}
                >
                    <CoverView>
                        {returnPositionProps.name || '想要去哪里'}
                    </CoverView>
                </CoverView>
            </CoverView>
            <CoverView
                onClick={onSelectCars}
                className={classes(
                    'btn',
                    `${rankCarHidden ? 'hidden' : 'pointer'}`
                )}
            >
                <CoverView>选择车辆</CoverView>
            </CoverView>
        </CoverView>
    )
}

export default Suspension
