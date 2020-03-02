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

  toMinePublish () {
    Taro.navigateTo({
      url: '/pages/mine_publish/index'
    })
  }

  render () {
    return (
      <View className='page'>
        <View className='user-info'>
          <AtAvatar circle openData={{ type: 'userAvatarUrl'}}></AtAvatar>
          <open-data type='userNickName'></open-data>
        </View>
        <AtList>
          <AtListItem title='我的发布' arrow='right' onClick={this.toMinePublish.bind(this)} />
          <AtListItem title='意见反馈' arrow='right' />
        </AtList>
      </View>
    )
  }
}

export default Index
