import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import NodataImage from '@/assets/images/no-data.png'

import './index.scss'

function onToPublish() {
  Taro.switchTab({
    url: '/pages/publish_type/index'
  })
}

export default function Nodata({tip, showBtn}) {
  return (
    <View className='no-data'>
      <Image src={NodataImage} />
      <View className='text'>{tip || '暂时还没有任何拼车信息'}</View>
      {
        showBtn ?
          <AtButton className='btn' size='small' type='primary' onClick={onToPublish}>去发布</AtButton> : ''
      }
    </View>
  )
}

Nodata.propsType = {
  showBtn: Boolean
}
