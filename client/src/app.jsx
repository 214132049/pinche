import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  componentDidMount () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/publish_type/index',
      'pages/mine/index',
      'pages/publish/index',
      'pages/statement/index',
      'pages/detail/index',
      'pages/mine_publish/index',
      'pages/search/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2577e3',
      navigationBarTitleText: '周沪拼车',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      custom: false,
      color: '#333333',
      selectedColor: '#333333',
      backgroundColor: '#ffffff',
      list: [{
        pagePath: 'pages/index/index',
        iconPath: './assets/images/icon_home.png',
        selectedIconPath: './assets/images/icon_home_HL.png',
        text: '首页'
      }, {
        pagePath: 'pages/publish_type/index',
        iconPath: './assets/images/icon_publish.png',
        selectedIconPath: './assets/images/icon_publish_HL.png',
        text: '发布'
      }, {
        pagePath: 'pages/mine/index',
        iconPath: './assets/images/icon_mine.png',
        selectedIconPath: './assets/images/icon_mine_HL.png',
        text: '我的'
      }]
    },
    permission: {
      'scope.userLocation': {
        desc: '您的定位信息用于更精准的获取拼车起始地信息'
      }
    }
  }

  componentDidShow () {
    Taro.cloud.init({
      // eslint-disable-next-line no-undef
      env: ENV_ID,
      traceUser: true
    })
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
