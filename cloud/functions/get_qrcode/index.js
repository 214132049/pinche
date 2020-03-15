// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const param = event.data
    if (!param.path) {
      await Promise.reject({errorCode: -200, errMsg: '缺少path字段'})
    }
    const result = await cloud.openapi.wxacode.get({
      path: 'page/index/index'
    })
    return {code: 200, errMsg: '', data: result}
  } catch (error) {
    return {code: error.errorCode || -200, errMsg: error.errMsg || error.message}
  }
}
