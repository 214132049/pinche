import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import 'dayjs/locale/zh-cn'
import './index.scss'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.locale('zh-cn')

const oneday = 24 * 3600 * 1000
const dateDesMap = ['今天', '明天', '后天']
const types = {
  1: { label: '人找车', color: '#fc6639', countLabel: '人同行'},
  2: { label: '车找人', color: '#fba81e', countLabel: '个座位'}
}

const iconStyles = {
  1: { value: 'man', color: '#769aff', label: '先生' },
  0: { value: 'woman', color: '#ff6e6e', label: '女士' },
}

const noop = () => {}

function makePhone(phoneNumber) {
  Taro.makePhoneCall({
    phoneNumber
  })
}

export default function MessageCard({ info = {}, onClick = noop }) {
  const iconStyle = iconStyles[info.sex] || {}
  const type = types[info.type] || {}
  const expired = dayjs().isSameOrAfter(`${info.date} ${info.time}`, 'minute')
  let dateDes = info.date
  if (dayjs().isSame(dayjs(info.date), 'date')) {
    // 同天
    dateDes = dateDesMap[0]
  } else if (dayjs().isBefore(dayjs(info.date), 'date')) {
    // 出发日期之前
    const instance = dayjs(`${info.date} 00:00:00`).valueOf() - dayjs().valueOf()
    if (instance < oneday) {
      dateDes = dateDesMap[1]
    } else if (instance < 2 * oneday) {
      dateDes = dateDesMap[2]
    }
  }

  // 同年不展示年份
  if (!dateDesMap.includes(dateDes) && dayjs().isSame(dayjs(info.date), 'year')) {
    dateDes = dayjs(info.date).format('MM-DD')
  }

  console.log(dateDes)
  function handleClick () {
    if (expired) return
    onClick()
  }

  return (
    <View className={expired ? 'info expired' : 'info'} onClick={() => handleClick()}>
      <View className='info-tag' style={{backgroundColor: type.color}}>{type.label}</View>
      <View className='info-city'>
        <View className='info-city--item'>
          <Text className='label start'>始</Text>{ info.start.name }
        </View>
        {/* <View className='line'></View> */}
        <View className='info-city--item'>
          <Text className='label end'>终</Text>{ info.end.name }
        </View>
      </View>
      <View className='info-detail'>
        <View className='info-detail--main'>
          <View className='info-detail--main__left'>
            <AtIcon value='clock' size='14' color='#666'></AtIcon>
            <Text className='time'>
              <Text className={dateDes === '今天' ? 'strong' : ''}>{dateDes}</Text> {info.time}
            </Text>
            <Text className='count'>
              <Text className='strong'>{info.count}</Text>{type.countLabel}
            </Text>
          </View>
          <View className='info-detail--main__right'>
            <Text className='price'>{!!info.price ? `¥${info.price}` : '面议'}</Text>
          </View>
        </View>
        {
          info.note ? <View className='info-detail--extra'>
            <Text className='label'>备注:</Text>{info.note}
          </View> : ''
        }
      </View>
      <View className='info-user'>
        <View className='info-user--content'>
          <AtIcon prefixClass='iconfont' value={iconStyle.value} size='16' color={iconStyle.color}></AtIcon>
          <Text className='name'>{info.name[0]}{iconStyle.label}</Text>
        </View>
        <AtButton className='at-icon at-icon-phone' type='secondary' size='small' onClick={() => makePhone(info.moblie)}>联系Ta</AtButton>
      </View>
    </View>
  )
}