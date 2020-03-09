import Taro from '@tarojs/taro'
import { View, Text, Label } from '@tarojs/components'

import './index.scss'

export default function PickerInput(props) {
  const { value = '', title = '', placeholder = '请选择', required = false } = props
  return (
    <View className='form-picker'>
      <View className='form-picker__container'>
        <View className={required ? 'form-picker__title required' : 'form-picker__title'}>
          <Label>{title}</Label>
        </View>
        <View
          className={
            'form-picker__content' + (value ? '' : ' placeholder')
          }
        >
          <Text>{value || placeholder}</Text>
        </View>
      </View>
      <Text className='at-icon at-icon-chevron-right' />
    </View>
  )
}

PickerInput.options = {
  addGlobalClass: true
}

PickerInput.propsType = {
  required: Boolean
}
