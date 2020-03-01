import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default function Statement() {
  return (
    <View className='statement'>
      <View className='statement-title'>
        《发布须知和免责声明》
      </View>
      <View className='statement-content'>
      </View>
    </View>
  )
}

Statement.config = {
  navigationBarTitleText: '平台声明'
}