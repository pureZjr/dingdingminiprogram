import '@minapp/wx'
import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/mobx'
import 'taro-ui/dist/style/index.scss'

import store from '@store/index'
import './styles/icon/iconfont.css'
import './app.scss'

class App extends Component {
    config: Taro.Config = {
        pages: [
            'container/pages/home/index',
            'container/pages/login/index',
            'container/pages/orderHistory/index',
            'container/pages/userInfo/index',
            'container/pages/order/index',
            'container/pages/selectCars/index',
            'container/pages/selectReturnPosition/index',
            'container/pages/wallet/index',
            'container/pages/info/index',
            'container/pages/editName/index',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
        },
        permission: {
            'scope.userLocation': {
                desc: '你的位置信息将用于地图展示',
            },
        },
    }

    render() {
        return <Provider store={store} />
    }
}

Taro.render(<App />, document.getElementById('app'))
