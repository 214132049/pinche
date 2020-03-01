import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'

import './index.scss'

const types = {
  1: { label: '人找车', color: '#fc6639'},
  2: { label: '车找人', color: '#fba81e'}
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
  return (
    <View className='info' onClick={() => onClick()}>
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
            <Text className='value text'>{info.date} {info.time}</Text>
            <Text className='label text'>出发时间</Text>
          </View>
          <View className='info-detail--main__right'>
            <Text className='value text'>¥{info.price || '面议'}</Text>
            <Text className='label text'>{info.count}人</Text>
          </View>
        </View>
        {
          info.note ? <View className='info-detail--extra'>
            <Text className='label'>备注</Text>{info.note}
          </View> : ''
        }
      </View>
      <View className='info-user'>
        <View className='info-user--content'>
          <AtIcon prefixClass='iconfont' value={iconStyle.value} size='18' color={iconStyle.color}></AtIcon>
          <Text className='name'>{info.name[0]}{iconStyle.label}</Text>
        </View>
        <AtButton className='at-icon at-icon-phone' type='secondary' size='small' onClick={() => makePhone(info.moblie)}>联系Ta</AtButton>
      </View>
    </View>
  )
}