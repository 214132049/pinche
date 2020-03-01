import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'

import './index.scss'

class Index extends Component {

  componentDidMount () {
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '我的',
  }

  componentDidShow () { }

  componentDidHide () { }

  onGotoMore () {
    console.log('onGotoMore')
  }

  render () {
    return (
      <View className='page'>
        <View className='user-info'>
          <AtAvatar circle openData={{ type: 'userAvatarUrl'}}></AtAvatar>
          <View className='user-info--conent'>
            <open-data type='userNickName'></open-data>
          </View>
        </View>
        <AtList>
          <AtListItem title='我的发布' arrow='right' />
          <AtListItem title='意见反馈' arrow='right' />
        </AtList>
      </View>
    )
  }
}

export default Index
