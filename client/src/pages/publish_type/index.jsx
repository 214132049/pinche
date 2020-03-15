import Taro from '@tarojs/taro'
import { View, Image, Text, Navigator } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import car from '@/assets/images/car.png'
import people from '@/assets/images/people.png'

import './index.scss'


export default function PublishType () {

  let tools = [
    { key: 1, title: '找车主', image: car },
    { key: 2, title: '找乘客', image: people },
  ]

  return (
    <View className='page'>
      <View className='tip'>
        免责声明：平台发布的所有信息，平台只负责发布、展示，与平台无关，平台不负任何责任。
        <Navigator url='/pages/statement/index'>点击查看服务协议详情。</Navigator>
      </View>
      <AtDivider className='divider' fontColor='#ccc' content='请选择您要发布的栏目' />
      <View className='at-row at-row__justify--around tools'>
        {
          tools.map(item => {
            return (
              <View className='at-col' key={item.key}>
                <navigator url={`/pages/publish/index?type=${item.key}`} hover-class='none'>
                  <View className='tools-item'>
                    <Image src={item.image} />
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
