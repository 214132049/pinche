// 云函数入口文件
const cloud = require('wx-server-sdk')
const schema = require('async-validator').default

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const descriptor = {
  type: {
    required: true, message: '拼车类型不能为空'
  },
  start: {
    required: true, message: '出发地不能为空', type: 'object',
    validator: (rule, value) => !!value.name
  },
  end: {
    required: true, message: '目的地不能为空', type: 'object',
    validator: (rule, value) => !!value.name
  },
  date: {
    required: true, message: '出发日期不能为空'
  },
  time: {
    required: true, message: '出发时间不能为空'
  },
  cartype (rule, value, callback, source) {
    if (source.type == '2' && !value) {
      return callback(new Error('车型不能为空'))
    }
    callback()
  },
  count (rule, value, callback, source) {
    let findPeople = source.type == '2'
    if (!value) {
      return callback(new Error(findPeople ? '空位数不能为空' : '乘坐人数不能为空'))
    }
    callback()
  },
  name: {
    required: true, message: '联系人姓名不能为空'
  },
  moblie: [
    {required: true, message: '联系人手机号不能为空'},
    {pattern: /^1\d{10}$/,message: '手机号不正确'}
  ],
  agreement: {
    required: true, message: '须同意《服务协议》', type: 'boolean',
    validator: (rule, value) => value
  }
}
const validator = new schema(descriptor)

// 云函数入口函数
exports.main = async (event, context) => {
  const eventData = event.data
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  try {
    // validate data
    await validator.validate(eventData).catch(e => {
      return Promise.reject({errorCode: -200, errMsg: e.errors[0].message})
    })

    // copy data
    let data = {}
    const props = ['type', 'start', 'end', 'date', 'time', 'cartype', 'count', 'price', 'name', 'sex', 'moblie', 'note']
    props.forEach(prop => {
      data[prop] = eventData[prop]
    })
    if (data.note.trim()) {
      await cloud.openapi.customerServiceMessage.send({
        content: data.note
      }).catch(e => Promise.reject({errorCode: -200, errMsg: '备注含有违法违规内容'}))
    }
    data.top = false // 置顶
    data.valid = true // 是否有效
    data.departureTime = new Date(`${data.date} ${data.time} GMT+0800`) // 出发时间
    data.endlocation = db.Geo.Point(data.end.longitude, data.end.latitude)
    data.startlocation = db.Geo.Point(data.start.longitude, data.start.latitude)
    data.openid = wxContext.OPENID
    data.appid = wxContext.APPID
    data.unionid = wxContext.UNIONID

    // insert data
    const { _id } = await db.collection('pinche_messages').add({
      data: {
        ...data,
        createtime: db.serverDate()
      }
    })
    return {code: 200, errMsg: '', id: _id}
  } catch (error) {
    return {code: error.errorCode || -200, errMsg: error.errMsg || error.message}
  }
}
