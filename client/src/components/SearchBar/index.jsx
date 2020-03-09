import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

const noop = () => {}

export default function SearchBar ({onClick = noop}) {
  const _onClick = onClick || noop
  return (
    <View className='search-bar'>
      <View className='search-bar_main' onClick={() => _onClick()}>
        <AtIcon value='search' color='#ccc' size='16'></AtIcon>
        <Text>起始地/出发日期/车型</Text>
      </View>
    </View>
  )
}