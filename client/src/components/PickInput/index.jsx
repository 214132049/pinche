import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default function PickerInput(props) {
  const { value = '', title = '', placeholder = '请选择' } = props
  return (
    <View className='form-picker'>
      <View className='form-picker__container'>
        <View className='form-picker__title'>
          <Text>{title}</Text>
        </View>
        <View
          className={
            'form-picker__content' + (value ? '' : ' placeholder')
          }
        >
          <Text>{value || placeholder}</Text>
        </View>
      </View>
    </View>
  )
}
