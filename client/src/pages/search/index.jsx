import Taro, { useState, useDidShow } from '@tarojs/taro'
import { View, Picker, Button, Text } from '@tarojs/components'
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import dayjs from 'dayjs'
import QQMapWX from '@/assets/js/qqmap-wx-jssdk'
import { PickInput } from '@/components'
import { carSelector, typeSelector } from '@/constants'

import './index.scss'

let eventChannel = null
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '6VSBZ-XPOWD-VGN42-PIKJN-C2MEH-6NBU4' // 必填
});
let currentCity = ''

const initForm = {
  type: '',
  start: {},
  end: {},
  cartype: '',
  date: ''
}

export default function Search () {
  const [form, setForm] = useState(initForm)
  const [isOpened, setIsOpened] = useState(false)
  // const [currentCity, setCurrentCity] = useState('start')

  useDidShow(function() {
    eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('setFromData', function(data) {
      if (Object.keys(data).length) {
        setForm(data)
      }
    })
  })

  function onOpensetting (e) {
    let authSetting = e.detail.authSetting
    if (authSetting['scope.userLocation']) {
      openMap()
      setIsOpened(false)
    }
  }

  function checkUserLocationAuth () {
    return Taro.getSetting().then(res => {
      if (!res.authSetting['scope.userLocation']) {
        return Taro.authorize({scope: 'scope.userLocation'})
          .then(() => true)
          .catch(() => false)
      }
      return Promise.resolve(true)
    })
  }

  async function onCityClick (prop) {
    currentCity = prop
    // setCurrentCity(prop)
    const isAuth = await checkUserLocationAuth()
    if (!isAuth) {
      setIsOpened(true)
      return
    }
    openMap()
  }

  function onFieldChange (e, prop) {
    let value = e
    if (typeof value === 'object') {
      value = value.detail.value
    }
    if (prop === 'cartype') {
      value = carSelector[+value].key
    }
    if (prop === 'type') {
      value = typeSelector[+value].key
    }
    updateForm(prop, value)
    return value
  }

  function openMap () {
    Taro.chooseLocation().then(({name, longitude, latitude}) => {
      updateForm(currentCity, {name, longitude, latitude})
    })
  }

  function onReset() {
    setForm(initForm)
  }

  function updateForm (prop, value) {
    let _form = { ...form, [prop]: value }
    setForm(_form)
  }

  function getLocation (address, target) {
    return new Promise((resolve, reject) => {
      qqmapsdk.geocoder({
        address,
        success: function(res) {
          const { location: {lat, lng} } = res.result
          if (!lat || !lng) {
            return reject({message: `未匹配到${target},请输入详细地址`})
          }
          resolve({
            name: address,
            latitude: lat,
            longitude: lng
          })
        },
        fail: function(e) {
          console.log(e)
          reject({message: `未匹配到${target}，请输入详细地址`})
        }
      })
    })

  }

  async function onSubmit() {
    let _form = {...form}
    try {
      if (_form.start && typeof _form.start === 'string') {
        _form.start = await getLocation(_form.start, '出发地')
      }
      if (_form.end && typeof _form.end === 'string') {
        _form.end = await getLocation(_form.end, '目的地')
      }
      // 输入后 又删除 改成{}
      _form.start = _form.start.name ? _form.start : ''
      _form.end = _form.end.name ? _form.end : ''
      eventChannel.emit('acceptFormData', { ..._form })
      await Taro.navigateBack()
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.message
      })
    }

  }

  let carSelected = carSelector.findIndex(v => v.key == form.cartype)
  let typeSelected = typeSelector.findIndex(v => v.key == form.type)
  return (
    <View className='search-form'>
      <View className='search-form_body'>
        <Picker
          mode='selector'
          range={typeSelector}
          rangeKey='label'
          value={Math.max(typeSelected, 0)}
          onChange={(e) => onFieldChange(e, 'type')}
        >
          <PickInput
            title='拼车类型'
            value={typeSelector[typeSelected] ? typeSelector[typeSelected].label : ''}
            placeholder='请选择车型'
          />
        </Picker>
        <AtInput
          name='start'
          title='出发地'
          type='text'
          placeholder='请选择出发地'
          value={form.start.name}
          onChange={(e) => onFieldChange(e, 'start')}
        >
          <Text className='at-icon at-icon-map-pin' onClick={() => onCityClick('start')}>
            地图选点
          </Text>
        </AtInput>
        <AtInput
          name='end'
          title='目的地'
          type='text'
          placeholder='请选择目的地'
          value={form.end.name}
          onChange={(e) => onFieldChange(e, 'end')}
        >
          <Text className='at-icon at-icon-map-pin' onClick={() => onCityClick('end')}>
          地图选点
          </Text>
        </AtInput>
        <Picker
          mode='date'
          start={dayjs().format('YYYY-MM-DD')}
          value={form.date}
          onChange={(e) => onFieldChange(e, 'date')}
        >
          <PickInput
            title='出发日期'
            value={form.date}
            placeholder='请选择出发日期'
          />
        </Picker>
        {
          form.type === '1' ?<Picker
            mode='selector'
            range={carSelector}
            rangeKey='label'
            value={Math.max(carSelected, 0)}
            onChange={(e) => onFieldChange(e, 'cartype')}
          >
            <PickInput
              title='车型'
              value={carSelector[carSelected] ? carSelector[carSelected].label : ''}
              placeholder='请选择车型'
            />
          </Picker> : ''
        }
        <AtModal isOpened={isOpened}>
          <AtModalHeader>小程序需要获取你的地理位置</AtModalHeader>
          <AtModalContent>
            您的定位信息用于更精准的获取拼车起始地信息
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => setIsOpened(false)}>取消</Button>
            <Button openType='openSetting' onOpenSetting={(e) => onOpensetting(e)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
      <View className='search-form_btn'>
        <AtButton type='primary' onClick={onSubmit} className='btn'>搜 索</AtButton>
        <AtButton type='secondary' onClick={onReset} className='btn'>重 置</AtButton>
      </View>
    </View>
  )
}
