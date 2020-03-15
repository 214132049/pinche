import Taro from '@tarojs/taro'
import { View, Button, Navigator } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'

import './index.scss'

export default function Mine() {
  return (
    <View className='page'>
      <View className='user-info'>
        <AtAvatar circle size='large' openData={{type: 'userAvatarUrl'}} />
        <open-data type='userNickName' />
      </View>
      <AtList>
        <Navigator url='/pages/mine_publish/index'>
          <AtListItem title='我的发布' arrow='right' />
        </Navigator>
        <Button
          className='contact-button'
          openType='feedback'
          sessionFrom='feedback'
        >
          <AtListItem title='意见反馈' arrow='right' />
        </Button>
        <Button
          className='contact-button'
          openType='contact'
          sessionFrom='contact'
        >
          <AtListItem title='联系客服' arrow='right' />
        </Button>
      </AtList>
    </View>
  )
}

Mine.config = {
  navigationBarTitleText: '我的',
}
