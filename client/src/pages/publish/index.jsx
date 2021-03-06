import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Button, CheckboxGroup, Checkbox, Navigator } from '@tarojs/components'
import { AtButton, AtInput, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import dayjs from 'dayjs'
import schema from 'async-validator'
import { PickInput } from '@/components'
import { carSelector, sexSelector } from '@/constants'
import Server from '@/utils/server'

import './index.scss'

const descriptor = {
  type: {
    required: true, message: '请选择拼车类型'
  },
  start: {
    required: true, message: '请选择出发地', type: 'object',
    validator: (rule, value) => !!value.name
  },
  end: {
    required: true, message: '请选择目的地', type: 'object',
    validator: (rule, value) => !!value.name
  },
  date: {
    required: true, message: '请选择出发日期'
  },
  time: {
    required: true, message: '请选择出发时间'
  },
  cartype (rule, value, callback, source) {
    if (source.type == '2' && !value) {
      return callback(new Error('请选择车型'))
    }
    callback()
  },
  count (rule, value, callback, source) {
    let findPeople = source.type == '2'
    if (!value) {
      return callback(new Error(findPeople ? '请选择空位数' : '请选择乘坐人数'))
    }
    callback()
  },
  price: {
    pattern: /^[1-9]\d*$/, message: '请填写整数金额'
  },
  name: {
    required: true, message: '请输入联系人姓名'
  },
  sex: {
    required: true, message: '请选择性别'
  },
  moblie: [
    {required: true, message: '请输入联系人手机号'},
    {pattern: /^1\d{10}$/,message: '手机号不正确'}
  ],
  agreement: {
    required: true, message: '请阅读并同意《免责声明》', type: 'boolean',
    validator: (rule, value) => value
  }
}

function initForm() {
  const date = dayjs().add(30, 'm')
  return {
    type: '', // 信息类型
    start: {}, // 出发地
    end: {}, // 目的地
    date: date.format('YYYY-MM-DD'),
    time: date.format('HH:mm'),
    cartype: '',
    count: '',
    price: '',
    name: '',
    sex: '',
    moblie: '',
    note: '',
    agreement: false
  }
}


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      countSelector: ['1', '2', '3', '4', '5', '6'],
      isOpened: false,
      checked: false,
      currentCity: 'start',
      form: { ...initForm() }
    }
    this.formValidator = null
  }

  componentWillMount() {
    let { type } = this.$router.params
    let findPeople = type === '2'
    Taro.setNavigationBarTitle({
      title: `发布${findPeople ? '找乘客' : '找车主'}信息`
    })
  }

  componentDidMount () {
    let { type, id } = this.$router.params
    this.formValidator = new schema(descriptor)
    this.updateForm('type', type)
    if (id) {
      this.getDetail(id)
    }
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '发布拼车信息'
  }

  componentDidShow () {
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
      this.openMap()
      this.closeModal()
    }
  }

  async onCityClick(prop) {
    this.setState({
      currentCity: prop
    })
    const isAuth = await this.checkUserLocationAuth()
    if (!isAuth) {
      this.openModal()
      return
    }
    this.openMap()
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

  openMap () {
    Taro.chooseLocation().then(({name, longitude, latitude}) => {
      this.updateForm(this.state.currentCity, {name, longitude, latitude})
    })
  }

  onFieldChange (prop, e) {
    let value = e
    if (typeof value === 'object') {
      value = value.detail.value
    }
    if (prop === 'sex') {
      value = this.state.sexSelector[+value].key
    }
    if (prop === 'cartype') {
      value = this.state.carSelector[+value].key
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

  onAgreementChange(e) {
    this.updateForm('agreement', !!e.detail.value[0])
    this.setState({
      checked: !!e.detail.value[0]
    })
  }

  async getDetail (id) {
    try {
      const { data } = await Server({
        name: 'get_detail',
        data: {
          id
        }
      })
      this.setState({
        form: { ...data }
      })
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: '加载失败，请重试'
      })
    }
  }

  async onSubmit() {
    try {
      await this.formValidator.validate(this.state.form)
      const { id } = await Server({
        name: 'save_publish',
        data: this.state.form,
        loadingTitle: '发布中...'
      })
      this.setState({
        checked: false,
        form: { ...initForm() }
      })
      await Taro.showToast({
        icon: 'success',
        title: '发布成功'
      })
      Taro.redirectTo({
        url: `/pages/detail/index?id=${id}`
      })
    } catch (e) {
      const error = e.errors ? e.errors[0] : e
      Taro.showToast({
        icon: 'none',
        title: error.message || error.errMsg
      })
    }
  }

  render () {
    const { form, countSelector, isOpened, checked }= this.state
    let sexSelected = sexSelector.findIndex(v => v.key == form.sex)
    let carSelected = carSelector.findIndex(v => v.key == form.cartype)
    let countSelected = form.count - 1
    let findPeople = form.type == '2'
    return (
      <View className='form'>
        <View className='form-card'>
          <View className='form-card__main'>
            <AtInput
              title='拼车类型'
              type='text'
              editable={false}
              value={findPeople ? '找乘客' : '找车主'}
            />
          </View>
        </View>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>拼车信息</Text>
          </View>
          <View className='form-card__main'>
            <AtInput
              required
              name='start'
              title='出发地'
              type='text'
              placeholder='请选择出发地'
              editable={false}
              value={form.start.name}
              onClick={this.onCityClick.bind(this, 'start')}
            />
            <AtInput
              required
              name='end'
              title='目的地'
              type='text'
              placeholder='请选择目的地'
              editable={false}
              value={form.end.name}
              onClick={this.onCityClick.bind(this, 'end')}
            />
            <Picker
              mode='date'
              start={dayjs().format('YYYY-MM-DD')}
              value={form.date}
              onChange={this.onFieldChange.bind(this, 'date')}
            >
              <PickInput
                required
                title='出发日期'
                value={form.date}
                placeholder='请选择出发日期'
              />
            </Picker>
            <Picker
              mode='time'
              value={form.time}
              start={form.time}
              end='23:59'
              onChange={this.onFieldChange.bind(this, 'time')}
            >
              <PickInput
                required
                title='出发时间'
                value={form.time}
                placeholder='请选择出发时间'
              />
            </Picker>
            {
              findPeople ?
              <Picker
                mode='selector'
                range={carSelector}
                rangeKey='label'
                value={Math.max(carSelected, 0)}
                onChange={this.onFieldChange.bind(this, 'cartype')}
              >
                <PickInput
                  required
                  title='车型'
                  value={carSelector[carSelected] ? carSelector[carSelected].label : ''}
                  placeholder='请选择车型'
                />
              </Picker> : ''
            }

            <Picker
              mode='selector'
              range={countSelector}
              value={Math.max(countSelected, 0)}
              onChange={this.onFieldChange.bind(this, 'count')}
            >
              <PickInput
                required
                title={findPeople ? '空位数' : '乘坐人数'}
                value={countSelector[countSelected]}
                placeholder={findPeople ? '请选择空位数' : '请选择乘坐人数'}
              />
            </Picker>
            <AtInput
              name='price'
              title='车费'
              type='phone'
              maxLength='10'
              placeholder='请输入车费(不填则面议)'
              value={form.price}
              onChange={this.onFieldChange.bind(this, 'price')}
            />
          </View>
        </View>
        <View className='form-card'>
          <View className='form-card__title'>
            <Text>联系人信息</Text>
          </View>
          <View className='form-card__main'>
            <AtInput
              required
              name='name'
              title='姓名'
              type='text'
              maxLength='10'
              placeholder='请输入姓名'
              value={form.name}
              onChange={this.onFieldChange.bind(this, 'name')}
            />
            <Picker
              mode='selector'
              range={sexSelector}
              rangeKey='label'
              value={Math.max(sexSelected, 0)}
              onChange={this.onFieldChange.bind(this, 'sex')}
            >
              <PickInput
                required
                title='性别'
                value={sexSelector[sexSelected] ? sexSelector[sexSelected].label : ''}
                placeholder='请选择性别'
              />
            </Picker>
            <AtInput
              required
              name='moblie'
              title='手机号码'
              type='phone'
              maxLength='11'
              placeholder='请输入手机号码'
              value={form.moblie}
              onChange={this.onFieldChange.bind(this, 'moblie')}
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
              onChange={this.onFieldChange.bind(this, 'note')}
              maxLength={100}
              placeholder='如携带宠物'
            />
          </View>
        </View>
        <View className='statement-box'>
          <CheckboxGroup onChange={this.onAgreementChange.bind(this)}>
            <Checkbox value='true' checked={checked} />我已请阅读并同意
            <Navigator url='/pages/statement/index'>《服务协议》</Navigator>
          </CheckboxGroup>
        </View>
        <View className='submit-btn'>
          <AtButton type='primary' onClick={this.onSubmit.bind(this)}>发 布</AtButton>
        </View>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>小程序需要获取你的地理位置</AtModalHeader>
          <AtModalContent>
            您的定位信息用于更精准的获取拼车起始地信息
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
