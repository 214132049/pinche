import getDateDes from '@/utils/date'
import arrowIcon from '@/assets/images/arrow.png'
import calendarIcon from '@/assets/images/calendar.png'

export default function (detail, qrcode) {
  let start = detail.start ? detail.start.name : ''
  let end = detail.end ? detail.end.name : ''

  const wxml = `
    <view class='share-image-container'>
      <view class='header'>
        <view class='header-city'>
          <text class='name'>${start}</text>
          <image src='${arrowIcon}' class='arrow-icon' />
          <text class='name'>${end}</text>
        </view>
        <View class='header-time'>
          <View class='item'>${detail.time} 出发</View>
          <View class='item date'>
            ${getDateDes(detail)}
            <image src='${calendarIcon}' class='calendar-icon' />
          </View>
        </View>
      </view>
      <view class='qrcode-image-box'>
        <Image src='${qrcode}' class='qrcode-image' />
        <text class='qrcode-text'>使用微信长按二维码识别</text>
      </view>
    </view>
  `
  const style = {
    shareImageContainer: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      width: 298,
      height: 350,
      color: '#333'
    },
    header: {
      flexDirection: 'column',
      backgroundColor: '#2577e3',
      color: '#ffffff',
      padding: 10,
      width: 298,
      height: 150
    },
    headerCity: {
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      width: 298,
      height: 75
    },
    name: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
    },
    arrowIcon: {
      width: 30,
      height: 30,
      marginRight: 10,
      marginLeft: 10,
      color: '#FFFFFF'
    },
    headerTime: {
      flexDirection: 'column',
      textAlign: 'center',
      marginTop: 5,
      width: 298,
      height: 50
    },
    item: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 25,
    },
    date: {
      width: 15,
      height: 15,
      verticalAlign: 'middle',
      fontSize: 14,
      marginLeft: 5
    },
    qrcodeImageBox: {
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      width: 298,
      height: 120,
      paddingBottom: 30,
      paddingTop: 30
    },
    qrcodeImage: {
      width: 90,
      height: 90,
      borderRadius: 90
    },
    qrcodeText: {
      width: 298,
      height: 20,
      marginTop: 10,
      fontSize: 20
    },
  }
  return { wxml, style }
}
