import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

class PickInput extends Component {
  defaultProps = {
    placeholder: '请选择'
  }
  
  constructor(props) {
    super(props)
  }

  render () {
    const { value, title, placeholder } = this.props
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
}

export default PickInput
