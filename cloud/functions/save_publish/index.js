// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await cloud.database().collection('pinche_messages').add({
      data: event.data
    })
    const result = await getResult({code: 200, errMsg: ''})
    return result
  } catch (error) {
    const result = await getResult({ code: error.errorCode, errMsg: error.errMsg})
    return result
  }
}

function getResult(data = {}) {
  return cloud.callFunction({
    name: 'common_result',
    data
  })
}