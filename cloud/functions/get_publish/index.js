// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const param = event.data
  const db = cloud.database()
  const _ = db.command
  try {
    const { OPENID } = cloud.getWXContext()
    // get data
    const collection = db.collection('pinche_messages')
    const filter = {
      valid: true
    } // 搜索条件
    if (param.type) {
      filter.type = param.type
    }
    if (param.start && param.start.longitude && param.start.latitude) {
      filter.startlocation = _.geoWithin({
        centerSphere: [
          [param.start.longitude, param.start.latitude],
          50 / 6378.1,
        ]
      })
    }
    if (param.end && param.end.longitude && param.end.latitude) {
      filter.endlocation = _.geoWithin({
        centerSphere: [
          [param.end.longitude, param.end.latitude],
          50 / 6378.1,
        ]
      })
    }
    if (param.ismine) {
      filter.openid = OPENID
    } else {
      let ms = new Date().setHours(0, 0, 0, 0)
      filter.departureTime = _.gt(new Date(ms))
    }

    if (param.date) {
      filter.departureTime = _.gt(new Date(`${param.date} 00:00:00 GMT+0800`)).lt(new Date(`${param.date} 23:59:59 GMT+0800`))
    }

    const pagesize = param.pagesize || 10 // 每页查询多少条，默认10条
    const pageno = param.pageno || 1 // 当前第几页，默认第一页
    // const { total } = await collection.where(filter).count()
    // const totalpage = Math.ceil(total / pagesize)
    const { data } = await collection.where(filter)
      .orderBy('departureTime', 'desc')
      .orderBy('createtime', 'desc')
      .skip((pageno - 1) * pagesize)
      .limit(pagesize)
      .get()
    return {code: 200, errMsg: '', data, pageno, pagesize}
  } catch (error) {
    return {code: error.errorCode || -200, errMsg: error.errMsg || error.message}
  }
}
