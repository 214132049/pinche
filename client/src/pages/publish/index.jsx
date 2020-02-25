import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtInput, AtRadio } from 'taro-ui'
import { PickInput } from '@/components'

import './index.scss'

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      form: {
        type: '', // 信息类型
        startCode: '', // 出发地
        endCode: '', // 目的地
        time: '',
        date: '2018-04-23'
      }
    }
  }

  componentWillMount () {
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '发布拼车信息'
  }

  componentDidShow () { }

  componentDidHide () { }

  onSubmit () {
  }

  handleChange (prop, e) {
    console.log(prop, e)
    let value = e
    if (typeof value === 'object') {
      value = value.detail.value
    }
    let form = { ...this.state.form, [prop]: value }
    this.setState({
      form
    })
    return value
  }

  render () {
    const form = this.state.form
    return (
      <View className='form'>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>拼车类型</Text>
          </View>
          <View className='form-card__main'>
            <AtRadio
              options={[
                { label: '人找车', value: 1 },
                { label: '车找人', value: 2 },
              ]}
              value={form.type}
              onClick={this.handleChange.bind(this, 'type')}
            />
          </View>
        </View>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>拼车信息</Text>
          </View>
          <View className='form-card__main'>
            <AtInput
              name='startCode'
              title='出发地'
              type='text'
              placeholder='请选择出发地'
              value={form.startCode}
              onChange={this.handleChange.bind(this, 'startCode')}
            />
            <AtInput
              name='endCode'
              title='目的地'
              type='text'
              placeholder='请选择目的地'
              value={form.endCode}
              onChange={this.handleChange.bind(this, 'endCode')}
            />
            <Picker
              mode='time'
              value={form.time}
              onChange={this.handleChange.bind(this, 'time')}
            >
              <PickInput
                title='出发时间'
                value={form.time}
                placeholder='请选择出发时间'
              ></PickInput>
            </Picker>
          </View>
        </View>
        <View className='submit-btn'>
          <AtButton type='primary' formType='submit'>提交</AtButton>
        </View>
      </View>
    )
  }
}

export default Index
