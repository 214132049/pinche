import Taro, { useShareAppMessage, useEffect, useState, useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Server from '@/utils/server'

import './index.scss'

export default function Detail() {

  const [detail = {}, setDetail] = useState({})
  const router = useRouter()

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我发布一个拼车信息，快来一起出发吧！',
      path: '/pages/detail/index?id=1234'
    }
  })

  useEffect(() => {
    const getDetail = async () => {
      const id = router.params.id
      console.log(id)
      try {
        const { data } = await Server({
          name: 'get_detail',
          data: {
            id
          },
          noloading: true
        })
        setDetail(data)
      } catch (error) {
        Taro.showToast({
          icon: 'none',
          title: '加载失败，请重试'
        })
      }
    }
    getDetail()
  }, [router.params.id])

  return (
    <View className='detail'>
      <View className='detail-main'>
        <View className='detail-main__header'>
          <Text className='name'>{detail.start.name}</Text>
          <View className='arrow'>
            <AtIcon prefixClass='iconfont' value='arrow' size='24' color='#fff'></AtIcon>
          </View>
          <Text className='name'>{detail.end.name}</Text>
        </View>
        <View className='detail-main__body'>
          <View>{detail.time}</View>
          <View>{detail.date}</View>
        </View>
      </View>
      <AtButton openType='share'>分享给朋友</AtButton>
    </View>
  )
}

Detail.config = {
  navigationBarTitleText: '详情'
}