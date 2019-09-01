import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Input, Button } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import { ComponentBENHelper } from '@utils/reactBemHelper'
import { editNickname } from '@server/api/users'
import './index.scss'

const classes = ComponentBENHelper('edit-name')

interface IStates {
    nickname: string
}

interface IStoresProps {
    UserStore: {
        setUserInfo: (userInfo: IUserStore.INFO) => void
    }
}
@inject('UserStore')
@observer
export default class EditName extends Component<IStoresProps, IStates> {
    constructor(props) {
        super(props)
        this.state = {
            nickname: '',
        }
    }

    config: Taro.Config = {
        navigationBarTitleText: '更改昵称',
    }

    changeName = (val: string) => {
        this.setState({
            nickname: val,
        })
    }
    save = () => {
        const { nickname } = this.state
        if (nickname.length > 20) {
            return Taro.atMessage({
                message: '名字不能超过20个字符',
                type: 'warning',
            })
        }
        editNickname({
            nickname,
        }).then(() => {
            this.props.UserStore.setUserInfo({
                niceName: nickname,
            })
            Taro.navigateBack()
        })
    }

    componentDidMount() {
        this.setState({
            nickname: this.$router.params.name,
        })
    }

    render() {
        return (
            <View className={classes('')}>
                <Input
                    className={classes('input')}
                    value={this.state.nickname}
                    onInput={e => this.changeName(e.detail.value)}
                />
                <Button
                    size="mini"
                    className={classes('btn')}
                    onClick={this.save}
                >
                    保存
                </Button>
                <AtMessage />
            </View>
        )
    }
}
