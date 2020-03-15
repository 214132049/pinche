import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import getDateDes from '@/utils/date'

import './index.scss'

dayjs.extend(isSameOrAfter)

const types = {
  1: { label: '找车主', color: '#fc6639', countLabel: '人同行'},
  2: { label: '找乘客', color: '#fba81e', countLabel: '个座位'}
}

const iconStyles = {
  1: { value: 'man', color: '#769aff', label: '先生' },
  0: { value: 'woman', color: '#ff6e6e', label: '女士' },
}

const noop = () => {}

function makePhone(phoneNumber, e) {
  e.stopPropagation()
  Taro.makePhoneCall({
    phoneNumber
  })
}

export default function MessageCard({
    info = {},
    onToDetail = noop,
    onToDelete = noop,
    onToEdit = noop,
    ismine
  }) {
  const iconStyle = iconStyles[info.sex] || {}
  const type = types[info.type] || {}
  const expired = dayjs().isSameOrAfter(`${info.date} ${info.time}`, 'minute')
  let dateDes = getDateDes(info)

  function handleItemClick () {
    onToDetail()
  }

  function deletePublish () {
    onToDelete()
  }

  function editPublish () {
    onToEdit()
  }

  return (
    <View className={expired ? 'info expired' : 'info'} onClick={handleItemClick.bind(this)}>
      <View className='info-tag' style={{backgroundColor: type.color}}>{type.label}</View>
      {
        expired ? <View className='expired-icon' /> : ''
      }
      <View className='info-city'>
        <View className='info-city--item'>
          <Text className='label start'>始</Text>{ info.start.name }
        </View>
        {/* <View className='line'></View> */}
        <View className='info-city--item'>
          <Text className='label end'>终</Text>{ info.end.name }
        </View>
      </View>
      <View className='info-detail'>
        <View className='info-detail--main'>
          <View className='info-detail--main__left'>
            <AtIcon value='clock' size='14' color={expired ? '#ccc' : '#666'} />
            <Text className='time'>
              <Text className={dateDes === '今天' ? 'strong' : ''}>{dateDes}</Text> {info.time}
            </Text>
            <Text className='count'>
              <Text className='strong'>{info.count}</Text>{type.countLabel}
            </Text>
          </View>
          <View className='info-detail--main__right'>
            <Text className='price'>{!!info.price ? `¥${info.price}` : '面议'}</Text>
          </View>
        </View>
        {
          info.note ? <View className='info-detail--extra'>
            <Text className='label'>备注:</Text>{info.note}
          </View> : ''
        }
      </View>
      <View className='info-user'>
        {
          ismine ? <View /> : <View className='info-user--content'>
            <AtIcon prefixClass='iconfont' value={iconStyle.value} size='16'
              color={expired ? '#ccc' : iconStyle.color}
            />
            <Text className='name'>{info.name[0]}{iconStyle.label}</Text>
          </View>
        }
        {/*使用多包裹一层多方式，阻止冒泡*/}
        <View className='buttons-box' onClick={e => e.stopPropagation()}>
          {
            ismine ?
              <View className='buttons'>
                <AtButton type='secondary' size='small'
                  onClick={deletePublish.bind(this)}
                >删除</AtButton>
                {
                  expired ?
                    '' :
                    <AtButton type='primary' size='small'
                      onClick={editPublish.bind(this)}
                    >编辑</AtButton>
                }
              </View> :
              !expired ?
                <AtButton className='at-icon at-icon-phone' type='secondary' size='small'
                  onClick={makePhone.bind(this, info.moblie)}
                >联系Ta</AtButton>
                : ''
          }
        </View>
      </View>
    </View>
  )
}
