import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtInput, AtRadio, AtTextarea, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import dayjs from 'dayjs'
import { PickInput } from '@/components'

import './index.scss'

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sexSelector: [{key: '1', label: '男'}, {key: '0', label: '女'}],
      countSelector: ['1', '2', '3', '4', '5', '6'],
      isOpened: false,
      form: {
        type: '', // 信息类型
        startCode: '', // 出发地
        endCode: '', // 目的地
        date: dayjs().format('YYYY-MM-DD'),
        time: dayjs().format('HH:mm'),
        count: '',
        contactName: '',
        contactSex: '1',
        contactPhone: ''
      }
    }
  }

  componentWillMount () {
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '发布拼车信息'
  }

  componentDidShow () { 
    this.checkUserLocationAuth()
  }

  componentDidHide () { }

  onSubmit () {
  }

  checkUserLocationAuth () {
    return Taro.getSetting().then(res => {
      if (!res.authSetting['scope.userLocation']) {
        return Taro.authorize({scope: 'scope.userLocation'})
          .then(() => true)
          .catch(() => false)
      }
      return Promise.resolve(true)
    })
  }

  async handleCityClick() {
    const isAuth = await this.checkUserLocationAuth()
    console.log(isAuth)
    if (!isAuth) {
      this.setState({
        isOpened: true
      })
      return
    }
    const key = 'AW3BZ-CPGKP-IBDDS-VJWF5-6BMZS-YVBVJ'
    const referer = 'pinche'
    Taro.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    })
  }

  handleChange (prop, e) {
    console.log(prop, e)
    let value = e
    if (typeof value === 'object') {
      value = value.detail.value
    }
    if (prop === 'contactSex') {
      value = this.state.sexSelector[+value].key
    }
    if (prop === 'count') {
      value = this.state.countSelector[+value]
    }
    let form = { ...this.state.form, [prop]: value }
    this.setState({
      form
    })
    return value
  }

  render () {
    const { form, sexSelector, countSelector, isOpened }= this.state
    let sexSelected = sexSelector.findIndex(v => v.key == form.contactSex)
    let countSelected = form.count - 1
    return (
      <View className='form'>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>拼车类型</Text>
          </View>
          <View className='form-card__main'>
            <AtRadio
              options={[
                { label: '人找车', value: '1' },
                { label: '车找人', value: '2' },
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
              editable={false}
              placeholder='请选择出发地'
              value={form.startCode}
              onClick={this.handleCityClick.bind(this)}
              onChange={this.handleChange.bind(this, 'startCode')}
            />
            <AtInput
              name='endCode'
              title='目的地'
              type='text'
              editable={false}
              placeholder='请选择目的地'
              value={form.endCode}
              onClick={this.handleCityClick.bind(this)}
              onChange={this.handleChange.bind(this, 'endCode')}
            />
            <Picker
              mode='date'
              start={dayjs().format('YYYY-MM-DD')}
              value={form.date}
              onChange={this.handleChange.bind(this, 'date')}
            >
              <PickInput
                title='出发日期'
                value={form.date}
                placeholder='请选择出发日期'
              ></PickInput>
            </Picker>
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
            <Picker
              mode='selector'
              range={countSelector}
              value={Math.max(countSelected, 0)}
              onChange={this.handleChange.bind(this, 'count')}
            >
              <PickInput
                title='乘坐人数'
                value={countSelector[countSelected]}
                placeholder='请选择乘坐人数'
              ></PickInput>
            </Picker>
          </View>
        </View>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>联系人信息</Text>
          </View>
          <View className='form-card__main'>
            <AtInput
              name='contactName'
              title='姓名'
              type='text'
              maxLength='10'
              placeholder='请输入姓名'
              value={form.contactName}
              onChange={this.handleChange.bind(this, 'contactName')}
            />
            <Picker
              mode='selector'
              range={sexSelector}
              rangeKey='label'
              value={sexSelected}
              onChange={this.handleChange.bind(this, 'contactSex')}
            >
              <PickInput
                title='性别'
                value={sexSelector[sexSelected].label}
                placeholder='请选择性别'
              ></PickInput>
            </Picker>
            <AtInput
              name='contactPhone'
              title='手机号码'
              type='phone'
              maxLength='11'
              placeholder='请输入手机号码'
              value={form.contactPhone}
              onChange={this.handleChange.bind(this, 'contactPhone')}
            />
          </View>
        </View>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>备注信息</Text>
          </View>
          <View className='form-card__main'>
            <AtTextarea
              value={form.note}
              onChange={this.handleChange.bind(this, 'note')}
              maxLength={100}
              placeholder='请输入备注信息'
            />
          </View>
        </View>
        <View className='submit-btn'>
          <AtButton type='primary' formType='submit'>提交</AtButton>
        </View>
        <AtModal isOpened={isOpened}>
          <AtModalContent>
            小程序获取你的位置信息，将用于出发地/目的地设置
          </AtModalContent>
          <AtModalAction>
            <View className='modal-btn'>
              <AtButton openType='openSetting'>确定</AtButton>
            </View>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Index
