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
    if (param.type) {
      filter.type = param.type
    }
    if (param.start) {
      filter.start = param.start
    }
    if (param.end) {
      filter.end = param.end
    }
    if (param.ismine) {
      filter.openid = param.openid
    }
    const pagesize = param.pagesize || 10 // 每页查询多少条，默认10条
    const pageno = param.pageno || 1 // 当前第几页，默认第一页
    const { total } = await collection.where(filter).count()
    const totalpage = Math.ceil(total / pagesize)
    const { data } = await collection.where(filter)
      .orderBy('createtime', 'desc')
      .skip((pageno - 1) * pagesize)
      .limit(pagesize)
      .get()
    const result = {code: 200, errMsg: '', data, total, totalpage, pageno, pagesize}
    return result
  } catch (error) {
    const result = {code: error.errorCode, errMsg: error.errMsg}
    return result
  }
}
