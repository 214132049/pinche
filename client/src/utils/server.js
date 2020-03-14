import Taro from '@tarojs/taro'
import logger from '@/utils/log'

export default async function({name, data = {}, loadingTitle = '', noloading = false}) {
  try {
    if (!noloading) {
      Taro.showLoading({
        title: loadingTitle || '加载中',
        mask: true
      })
    }
    const res = await Taro.cloud.callFunction({
      name,
      data: {
        data
      }
    })
    if (!noloading) {
      Taro.hideLoading()
    }
    logger.info({callFunctionName: name, callFunctionResult: res})
    const result = res.result
    return result.code === 200 ? Promise.resolve(result) : Promise.reject(result)
  } catch (error) {
    logger.info({callFunctionName: name, callFunctionError: error})
    if (!noloading) {
      Taro.hideLoading()
    }
  }
}
