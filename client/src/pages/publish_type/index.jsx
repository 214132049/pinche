import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import car from '@/assets/images/car.png'
import people from '@/assets/images/people.png'

import './index.scss'


export default function PublishType () {

  let tools = [
    { key: 1, title: '人找车', image: car },
    { key: 2, title: '车找人', image: people },
  ]

  return (
    <View className='page'>
      <AtDivider className='divider' fontColor='#ccc' content='选择发布类型'></AtDivider>
      <View className='at-row at-row__justify--around tools'>
        {
          tools.map(item => {
            return (
              <View className='at-col' key={item.key}>
                <navigator url={`/pages/publish/index?type=${item.key}`} hover-class='none'>
                  <View className='tools-item'>
                    <Image src={item.image}></Image>
                    <Text>{item.title}</Text>
                  </View>
                </navigator>
              </View>
            )
          })
        }
      </View>
    </View>
  )
}

PublishType.config = {
  navigationBarTitleText: '拼车类型',
}
