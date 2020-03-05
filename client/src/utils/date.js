import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const dateDesMap = ['今天', '明天', '后天']
const oneday = 24 * 3600 * 1000

export default function getDateDes (info) {
  let dateDes = info.date
  if (dayjs().isSame(dayjs(info.date), 'date')) {
    // 同天
    dateDes = dateDesMap[0]
  } else if (dayjs().isBefore(dayjs(info.date), 'date')) {
    // 出发日期之前
    const instance = dayjs(`${info.date} 00:00:00`).valueOf() - dayjs().valueOf()
    if (instance < oneday) {
      dateDes = dateDesMap[1]
    } else if (instance < 2 * oneday) {
      dateDes = dateDesMap[2]
    }
  }

  // 同年不展示年份
  if (!dateDesMap.includes(dateDes) && dayjs().isSame(dayjs(info.date), 'year')) {
    dateDes = dayjs(info.date).format('MM-DD')
  }
  return dateDes
}