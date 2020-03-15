// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'text',
      text: {
        content: '您的消息已收到，稍后联系您。'
      }
    })
    return result
  } catch (err) {
    return err
  }
}
