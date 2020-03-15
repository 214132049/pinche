import getDateDes from '@/utils/date'

export default function (detail, qrcode) {
  let start = detail.start ? detail.start.name : ''
  let end = detail.end ? detail.end.name : ''

  const wxml = `
    <view class='share-image-container'>
      <view class='header'>
        <view class='header-city'>
          <text class='name'>${start}</text>
          <text class='iconfont iconfont-arrow' />
          <text class='name'>${end}</text>
        </view>
        <View class='header-time'>
          <View class='item'>${detail.time} 出发</View>
          <View class='item'>
            ${getDateDes(detail)}
            <Text class='at-icon at-icon-calendar' />
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
      boxSizing: 'border-box',
      backgroundColor: '#2577e3',
      color: '#ffffff',
      padding: 10,
      width: 298,
      height: 150
    },
    headerCity: {
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      width: 298,
      height: 75
    },
    name: {
      flex: 1,
      height: 75
    },
    iconfontArrow: {
      width: 80,
      height: 75,
      marginRight: 10,
      marginLeft: 10,
      fontSize: 30,
      color: '#FFFFFF'
    },
    headerTime: {
      textAlign: 'center',
      marginTop: 5,
      width: 298,
      height: 50
    },
    item: {
      width: 298,
      height: 50,
      lineHeight: 50
    },
    atIcon: {
      width: 15,
      height: 15,
      verticalAlign: 'middle',
      fontSize: 14,
      marginLeft: 5
    },
    qrcodeImageBox: {
      boxSizing: 'border-box',
      textAlign: 'center',
      width: 298,
      height: 180,
      paddingBottom: 30,
      paddingTop: 30
    },
    qrcodeImage: {
      width: 100,
      height: 100,
      borderRadius: 100
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
