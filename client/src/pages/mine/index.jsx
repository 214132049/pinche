import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'

import './index.scss'

class Index extends Component {

  config = {
    navigationBarTitleText: '周沪拼车'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onGotoMore () {
    console.log('onGotoMore')
  }

  render () {
    return (
      <View className='index'>
        我的
      </View>
    )
  }
}

export default Index
