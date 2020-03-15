// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const param = event.data
  try {
    // get data
    const db = cloud.database()
    const collection = db.collection('pinche_messages')
    const filter = {} // 搜索条件
    if (!param.id) {
      throw new Error('缺少参数id')
    }
    const { data } = await collection.where({
      _id: param.id,
      valid: true
    }).get()
    if (data.length !== 1) {
      throw new Error('暂无数据')
    }
    return {code: 200, errMsg: '', data: data[0]}
  } catch (error) {
    return {code: error.errorCode || -200, errMsg: error.errMsg || error.message}
  }
}
