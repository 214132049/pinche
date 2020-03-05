import Taro, { useShareAppMessage, useEffect, useState, useRouter } from '@tarojs/taro'
import { View, Text, Image, Button, Label } from '@tarojs/components'
import { AtDivider, AtIcon, AtButton } from 'taro-ui'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import Server from '@/utils/server'
import getDateDes from '@/utils/date'

import weixin from '@/assets/images/weixin.png'
// import miniCode from '@/assets/images/mini_code.png'
import call from '@/assets/images/call.png'

import './index.scss'

dayjs.extend(isSameOrAfter)

const types = {
  1: { label: '人找车', color: '#fc6639', countLabel: '人同行'},
  2: { label: '车找人', color: '#fba81e', countLabel: '个座位'}
}

const iconStyles = {
  1: { value: 'man', color: '#769aff', label: '先生' },
  0: { value: 'woman', color: '#ff6e6e', label: '女士' },
}

function makePhone(phoneNumber) {
  Taro.makePhoneCall({
    phoneNumber
  })
}

function goHomePage() {
  Taro.switchTab({
    url: '/pages/index/index'
  })
}

export default function Detail() {

  const [detail, setDetail] = useState({
    name: ''
  })
  const [expired, setExpired] = useState(false)
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
        const _expired = dayjs().isSameOrAfter(`${data.date} ${data.time}`, 'minute')
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
  let fromEdit = router.params.form == 1
  let type = types[detail.type] ? types[detail.type].label : ''
  let countLabel = types[detail.type] ? types[detail.type].countLabel : ''
  let price = !!detail.price ? `¥${detail.price}` : '面议'
  let sexlabel = iconStyles[detail.sex] ? iconStyles[detail.sex].label : ''

  return (
    <View className='detail'>
      <View className='detail-header'>
        {
          expired ? <View className='expired-icon'></View> : ''
        }
        <View className='detail-header__city'>
          <Text className='name'>{detail.start.name}</Text>
          <View className='arrow'>
            <AtIcon prefixClass='iconfont' value='arrow' size='28' color='#ffffff'></AtIcon>
          </View>
          <Text className='name'>{detail.end.name}</Text>
        </View>
        <View className='detail-header__time'>
          <View>{detail.time} 出发</View>
          <View>{getDateDes(detail)} <Text className='at-icon at-icon-calendar'></Text></View>
        </View>
      </View>
      <View className='detail-body'>
        <View className='detail-body__item'>
          <Label className='detail-body__item--title'>拼车类型</Label>
          <View className='detail-body__item--content'>
            <Text>{type}</Text>
          </View>
        </View>
        <View className='detail-body__item'>
          <Label className='detail-body__item--title'>车费</Label>
          <View className='detail-body__item--content'>
            <Text>{price}</Text>
          </View>
        </View>
        <View className='detail-body__item'>
          <Label className='detail-body__item--title'>联系人</Label>
          <View className='detail-body__item--content'>
            <Text>{detail.name[0] + sexlabel}</Text>
          </View>
        </View>
        <View className='detail-body__item'>
          <Label className='detail-body__item--title'>{detail.type == '2' ? '空位数' : '乘坐人数'}</Label>
          <View className='detail-body__item--content'>
            <Text>{detail.count + countLabel}</Text>
          </View>
        </View>
        <View className='detail-body__item'>
          <Label className='detail-body__item--title'>备注</Label>
          <View className='detail-body__item--content'>
            <Text>{detail.note}</Text>
          </View>
        </View>
      </View>
      {
        !expired ? <View>
          <AtDivider className='divider' fontColor='#ccc' content='快分享给朋友吧'></AtDivider>
            <View className='share-btns'>
              <Button openType='share'>
                <Image src={weixin}></Image>
              </Button>
              {/* <Button>
                <Image src={miniCode}></Image>
              </Button> */}
              <Button onClick={makePhone.bind(this, detail.moblie)}>
                <Image src={call}></Image>
              </Button>
            </View>
          </View> : ''
      }
      {
        !fromEdit ? <View className='home-btn'>
          <AtButton type='primary' size='small' onClick={goHomePage.bind(this)}>返回首页</AtButton>
        </View> : ''
      }
    </View>
  )
}

Detail.config = {
  navigationBarTitleText: '详情'
}