import Taro, { Component } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'

import './index.scss'

class Index extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '周沪拼车',
    navigationStyle: 'custom'
  }

  componentDidShow () { }

  componentDidHide () { }

  onGotoMore () {
    console.log('onGotoMore')
  }

  render () {
    return (
      <View className='index'>
        <Map></Map>
      </View>
    )
  }
}

export default Index
