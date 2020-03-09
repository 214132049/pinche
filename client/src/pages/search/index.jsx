import Taro, { useState, useDidShow } from '@tarojs/taro'
import { View, Picker, Button } from '@tarojs/components'
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtIcon } from 'taro-ui'
import dayjs from 'dayjs'
import QQMapWX from '@/assets/js/qqmap-wx-jssdk'
import { PickInput } from '@/components'

import './index.scss'

const carSelector = [
  {key: '1', label: '轿车'},
  {key: '2', label: 'SUV'},
  {key: '3', label: 'MPV'},
  {key: '4', label: '其他'}
]

let eventChannel = null
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '6VSBZ-XPOWD-VGN42-PIKJN-C2MEH-6NBU4' // 必填
});
let currentCity = ''

export default function Search () {
  const [form, setForm] = useState({
    type: '',
    start: {},
    end: {},
    cartype: '',
    date: ''
  })
  const [isOpened, setIsOpened] = useState(false)
  // const [currentCity, setCurrentCity] = useState('start')

  useDidShow(function() {
    eventChannel = this.$scope.getOpenerEventChannel()
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
    updateForm(prop, value)
    return value
  }

  function openMap () {
    Taro.chooseLocation().then(({name, longitude, latitude}) => {
      updateForm(currentCity, {name, longitude, latitude})
    })
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
          const { title, location: {lat, lng} } = res.result
          if (!lat || !lng) {
            return reject({message: `未匹配到${target}`})
          }
          resolve({
            name: title,
            latitude: lat,
            longitude: lng
          })
        },
        fail: function() {
          reject({message: `未匹配到${target}`})
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
      Taro.navigateBack()
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error.message
      })
    }
    
  }

  let carSelected = carSelector.findIndex(v => v.key == form.cartype)
  return (
    <View className='search-form'>
      <View className='search-form_body'>
        <AtInput
          name='start'
          title='出发地'
          type='text'
          placeholder='请选择出发地'
          value={form.start.name}
          onChange={(e) => onFieldChange(e, 'start')}
        >
          <AtIcon value='map-pin' color='#ccc' onClick={() => onCityClick('start')} />
        </AtInput>
        <AtInput
          name='end'
          title='目的地'
          type='text'
          placeholder='请选择目的地'
          value={form.end.name}
          onChange={(e) => onFieldChange(e, 'end')}
        >
          <AtIcon value='map-pin' color='#ccc' onClick={() => onCityClick('end')} />
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
          ></PickInput>
        </Picker>
        <Picker
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
          ></PickInput>
        </Picker>
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
        <AtButton type='primary' onClick={onSubmit}>搜 索</AtButton>
      </View>
    </View>
  )
}