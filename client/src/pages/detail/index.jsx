import Taro, { useShareAppMessage, useEffect, useState, useRouter, useRef } from '@tarojs/taro'
import { View, Text, Image, Button, Label } from '@tarojs/components'
import { AtButton, AtDivider } from 'taro-ui'
// import wxmlToCanvas from 'wxml-to-canvas'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import Server from '@/utils/server'
import getDateDes from '@/utils/date'
import { carSelector } from '@/constants'

import weixin from '@/assets/images/weixin.png'
// import miniCode from '@/assets/images/mini_code.png'
import call from '@/assets/images/call.png'

import './index.scss'
import createWxmlAndStyle from './share'

dayjs.extend(isSameOrAfter)

const types = {
  1: { label: '找车主', color: '#fc6639', countLabel: '人'},
  2: { label: '找乘客', color: '#fba81e', countLabel: '个'}
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
  const qrcodeRef = useRef(null);
  const [detail, setDetail] = useState({})
  const [shareImage, setShareImage] = useState('')
  const [expired, setExpired] = useState(false)
  const [shareModalOpened, setShareModalOpened] = useState(false)
  const router = useRouter()
  const sharePage = `/pages/detail/index?id=${router.params.id}&from=share`

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我发布一个拼车信息，快来一起出发吧！',
      path: sharePage
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
          }
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

  async function getQrCode() {
    try {
      const { data } = await Server({
        name: 'get_qrcode',
        data: {
          path: sharePage
        }
      })
      console.log(data)

    } catch (e) {
      Taro.showToast({
        icon: 'none',
        title: '获取失败，请重试'
      })
    }
  }

  function toggleShareModal(res) {
    setShareModalOpened(res)
  }

  function getQrCodeUrl (data) {
    const arrayBuffer = new Uint8Array(data.buffer)
    const base64 = Taro.arrayBufferToBase64(arrayBuffer)
  }

  async function createShareImage () {
    let { wxml, style } = createWxmlAndStyle(detail)
    let res = await qrcodeRef.current.renderToCanvas({ wxml, style })
    console.log(res)
    await toggleShareModal(true)
  }

  async function exportShareImage () {
    let {tempFilePath} = await qrcodeRef.current.canvasToTempFilePath()
    console.log(tempFilePath)
    await setShareImage(tempFilePath)
  }

  let type = types[detail.type] ? types[detail.type].label : ''
  let countLabel = types[detail.type] ? types[detail.type].countLabel : ''
  let price = !!detail.price ? `¥${detail.price}` : '面议'
  let sexlabel = iconStyles[detail.sex] ? iconStyles[detail.sex].label : ''
  let userName = detail.name ? detail.name[0] : ''
  let start = detail.start ? detail.start.name : ''
  let end = detail.end ? detail.end.name : ''
  // let scene = Taro.getLaunchOptionsSync().scene
  let fromShare = router.params.from === 'share'
  let cartype = carSelector.find(v => v.key === detail.type) || {}
  return Object.keys(detail).length === 0 ?
    '' :
    (
      <View className={expired ? 'detail expired' : 'detail'}>
        <View className='detail-header'>
          {
            expired ? <View className='expired-icon' /> : ''
          }
          <View className='detail-header__city'>
            <Text className='name'>{start}</Text>
            <Text className='iconfont iconfont-arrow' />
            <Text className='name'>{end}</Text>
          </View>
          <View className='detail-header__time'>
            <View className='item'>{detail.time} 出发</View>
            <View className='item'>
              {getDateDes(detail)}
              <Text className='at-icon at-icon-calendar' />
            </View>
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
              <Text>{userName + sexlabel}</Text>
            </View>
          </View>
          {
            detail.type === '2' ? <View className='detail-body__item'>
              <Label className='detail-body__item--title'>车型</Label>
              <View className='detail-body__item--content'>
                <Text>{cartype.label}</Text>
              </View>
            </View> : ''
          }
          <View className='detail-body__item'>
            <Label className='detail-body__item--title'>
              {detail.type === '2' ? '空位数' : '乘坐人数'}
            </Label>
            <View className='detail-body__item--content'>
              <Text>{detail.count + countLabel}</Text>
            </View>
          </View>
          {
            detail.note ? <View className='detail-body__item'>
              <Label className='detail-body__item--title'>备注</Label>
              <View className='detail-body__item--content'>
                <Text>{detail.note}</Text>
              </View>
            </View> : ''
          }
        </View>
        {
          !expired ? <View>
            <AtDivider className='divider' fontColor='#ccc' content='·' />
            <View className='share-btns'>
              <Button openType='share'>
                <Image src={weixin} />
                <View className='text'>分享给好友</View>
              </Button>
              {/*<Button onClick={createShareImage}>*/}
              {/*  <Image src={miniCode} />*/}
              {/*  <View className='text'>分享二维码</View>*/}
              {/*</Button>*/}
              <Button onClick={makePhone.bind(this, detail.moblie)}>
                <Image src={call} />
                <View className='text'>联系Ta</View>
              </Button>
            </View>
          </View> : ''
        }
        {
          fromShare ?
            <View className='home-btn'>
              <AtButton type='secondary' size='small'
                onClick={goHomePage}
              >返回首页</AtButton>
            </View>
          : ''
        }
        {/*<View*/}
        {/*  className='share-image-box'*/}
        {/*  style={{ left: shareModalOpened ? '0' : '-200%'}}*/}
        {/*>*/}
        {/*  <View className='share-image-content'>*/}
        {/*    <wxmlToCanvas className='widget' width='298' height='350' ref={qrcodeRef} />*/}
        {/*    <View className='at-icon at-icon-close' onClick={() => toggleShareModal(false)} />*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    )
}

Detail.config = {
  navigationBarTitleText: '详情',
}
