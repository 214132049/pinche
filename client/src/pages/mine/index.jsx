import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'

import './index.scss'

export default function Mine() {

  function toMinePublish () {
    Taro.navigateTo({
      url: '/pages/mine_publish/index'
    })
  }

  return (
    <View className='page'>
      <View className='user-info'>
        <AtAvatar circle size='large' openData={{type: 'userAvatarUrl'}} />
        <open-data type='userNickName' />
      </View>
      <AtList>
        <AtListItem title='我的发布' arrow='right' onClick={() => toMinePublish()} />
        {/*<AtListItem title='意见反馈' arrow='right' />*/}
      </AtList>
    </View>
  )
}

Mine.config = {
  navigationBarTitleText: '我的',
}
