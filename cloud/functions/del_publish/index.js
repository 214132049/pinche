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
    return {code: 200, errMsg: ''}
  } catch (error) {
    return {code: error.errorCode || -200, errMsg: error.errMsg || error.message}
  }
}
