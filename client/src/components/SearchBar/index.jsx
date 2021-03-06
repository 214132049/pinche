import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { typeSelector, carSelector } from '@/constants'
import './index.scss'

const noop = () => {}
const initSearchText = ['拼车类型', '起始地', '出发日期', '车型']

function getSearchText(sourceObj) {
  let obj = { ...sourceObj }
  if (obj.type) {
    let type = typeSelector.find(k => k.key === obj.type) || {}
    obj.type = type.label
  }
  if (obj.start && typeof obj.start === 'object') {
    obj.start = obj.start.name
  }
  if (obj.end && typeof obj.end === 'object') {
    obj.end = obj.end.name
  }
  if (obj.cartype) {
    let cartype = carSelector.find(k => k.key === obj.cartype) || {}
    obj.cartype = cartype.label
  }

  if (obj.start && obj.end) {
    obj.startToEnd = `${obj.start} → ${obj.end}`
    delete obj.start
    delete obj.end
  }

  return Object.values(obj)
}

function filter(sourceObj) {
  let cloneObj = {}
  let keys = Object.keys(sourceObj)
  keys.forEach(key => {
    let value = sourceObj[key]
    if (value || (typeof value === 'object' && Object.keys(value).length)) {
      cloneObj[key] = value
    }
  })
  return cloneObj
}

function SearchBar ({onClick = noop, onClear = noop, value: searchValue = {}}) {
  const _onClick = onClick || noop
  const _onClear = onClear || noop
  let _searchValue = filter(searchValue)
  let keys = Object.keys(_searchValue)
  let searchText = keys.length ? getSearchText(_searchValue) : initSearchText
  let className = !!keys.length ? 'search-bar_main--value' : 'search-bar_main--placeholder'

  return (
    <View className='search-bar'>
      <View className='search-bar_main' onClick={() => _onClick()}>
        {
          !keys.length ? <Text className='at-icon at-icon-search' /> : ''
        }
        <Text
          className={className}
        >
          {searchText.filter(t => t).join('/')}
        </Text>
      </View>
      {
        keys.length ?
          <View className='at-icon at-icon-close' onClick={() => _onClear()} /> :
          ''
      }
    </View>
  )
}

function areEqual({value: oldValue}, {value: newValue}) {
  let _oldValue = JSON.stringify(oldValue)
  let _newValue = JSON.stringify(newValue)
  return _oldValue === _newValue
}

SearchBar.options = {
  addGlobalClass: true
}

export default Taro.memo(SearchBar, areEqual)
