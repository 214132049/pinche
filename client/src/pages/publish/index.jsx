import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput, AtRadio, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import dayjs from 'dayjs'
import { PickInput } from '@/components'

import './index.scss'

const chooseLocation = Taro.requirePlugin('chooseLocation');

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sexSelector: [{key: '1', label: '男'}, {key: '0', label: '女'}],
      countSelector: ['1', '2', '3', '4', '5', '6'],
      isOpened: false,
      currentCity: 'start',
      form: {
        type: '', // 信息类型
        start: '', // 出发地
        end: '', // 目的地
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
    let location = chooseLocation.getLocation()
    if (location) {
      this.updateForm(this.state.currentCity, location.name)
    }
  }

  componentDidHide () { }

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

  onOpensetting(e) {
    let authSetting = e.detail.authSetting
    if (authSetting['scope.userLocation']) {
      this.toLocationPlugin()
      this.closeModal()
    }
  }
  
  async handleCityClick(prop) {
    this.setState({
      currentCity: prop
    })
    const isAuth = await this.checkUserLocationAuth()
    console.log(isAuth)
    if (!isAuth) {
      this.openModal()
      return
    }
    this.toLocationPlugin()
  }

  onGetPhoneNumber(e) {
    console.log(e)
  }

  closeModal() {
    this.setState({
      isOpened: false
    })
  }

  openModal() {
    this.setState({
      isOpened: true
    })
  }

  toLocationPlugin () {
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
    this.updateForm(prop, value)
    return value
  }

  updateForm (prop, value) {
    let form = { ...this.state.form, [prop]: value }
    this.setState({
      form
    })
  }

  onSubmit() {
    Taro.cloud.callFunction({
      name: 'save_publish',
      data: {
        data: this.state.form
      }
    }).then(res => {
      console.log(res)
    })
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
              name='start'
              title='出发地'
              type='text'
              placeholder='请选择出发地'
              value={form.start}
            >
              <View
                className='at-icon at-icon-map-pin'
                onClick={this.handleCityClick.bind(this, 'start')}
              >
                <Text className='map-text'>地图选点</Text>
              </View>
            </AtInput>
            <AtInput
              name='end'
              title='目的地'
              type='text'
              placeholder='请选择目的地'
              value={form.end}
            >
              <View
                className='at-icon at-icon-map-pin'
                onClick={this.handleCityClick.bind(this, 'end')}
              >
                <Text className='map-text'>地图选点</Text>
              </View>
            </AtInput>
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
                title='人数/空位'
                value={countSelector[countSelected]}
                placeholder='请选择人数/空位'
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
            ></AtInput>
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
          <AtButton type='primary' onClick={this.onSubmit.bind(this)}>发 布</AtButton>
        </View>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>小程序需要获取你的地理位置</AtModalHeader>
          <AtModalContent>
            小程序获取你的位置信息，将用于出发地/目的地设置
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal.bind(this)}>取消</Button>
            <Button openType='openSetting' onOpenSetting={this.onOpensetting.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Index
