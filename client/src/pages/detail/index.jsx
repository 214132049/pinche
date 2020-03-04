import Taro, { useShareAppMessage, useEffect, useState, useRouter } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtDivider, AtIcon } from 'taro-ui'
import Server from '@/utils/server'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import weixin from '@/assets/images/weixin.png'
import miniCode from '@/assets/images/mini_code.png'

import './index.scss'

dayjs.extend(isSameOrAfter)

export default function Detail() {

  const [detail = {}, setDetail] = useState({})
  const [expired = false, setExpired] = useState({})
  const router = useRouter()

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我发布一个拼车信息，快来一起出发吧！',
      path: `/pages/detail/index?id=${router.params.id}`
    }
  })

  useEffect(() => {
    const getDetail = async () => {
      const id = router.params.id
      try {
        const { data } = await Server({
          name: 'get_detail',
          data: {
            id
          },
          noloading: true
        })
        const _expired =  dayjs().isSameOrAfter(`${data.date} ${data.time}`, 'minute')
        setDetail(data)
        setExpired(_expired)
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
    <View className={expired ? 'detail expired' : 'detail'}>
      <View className='detail-main'>
        <View className='detail-main__header'>
          <Text className='name'>{detail.start.name}</Text>
          <View className='arrow'>
            <AtIcon prefixClass='iconfont' value='arrow' size='24' color='#333333'></AtIcon>
          </View>
          <Text className='name'>{detail.end.name}</Text>
        </View>
        <View className='detail-main__body'>
          <View>{detail.time}</View>
          <View>{detail.date}</View>
        </View>
      </View>
      <AtDivider className='divider' fontColor='#ccc' content='快分享给朋友吧'></AtDivider>
      <View className='share-btns'>
        <Button openType='share'>
          <Image src={weixin}></Image>
        </Button>
        <Button>
          <Image src={miniCode}></Image>
        </Button>
      </View>
    </View>
  )
}

Detail.config = {
  navigationBarTitleText: '详情'
}