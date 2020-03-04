// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event.data
  try {
    if (!id) {
      await Promise.reject({errorCode: -200, errMsg: 'id不能为空'})
    }
    const db = cloud.database()
    await db.collection('pinche_messages').where({
      _id: id
    }).update({
      data: {
        valid: false
      }
    })
    const result = {code: 200, errMsg: ''}
    return result
  } catch (error) {
    const result = {code: error.errorCode, errMsg: error.errMsg}
    return result
  }
}