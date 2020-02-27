import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import refresh from '@/images/refresh.png'
import car from '@/images/car.png'
import publish from '@/images/publish.png'
import people from '@/images/people.png'

import './index.scss'


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tools: [
        { key: 1, title: '刷新', image: refresh },
        { key: 2, title: '发布', image: publish },
        { key: 3, title: '人找车', image: car },
        { key: 4, title: '车找人', image: people },
      ]
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  config = {
    navigationBarTitleText: '周沪拼车',
  }

  componentDidShow () { }

  componentDidHide () { }

  onGotoMore () {
    console.log('onGotoMore')
  }

  onItemClick (item) {
    if (item.key === 2) {
      Taro.switchTab({
        url: '/pages/publish/index'
      })
    }
  }

  render () {
    const tools = this.state.tools
    return (
      <View className='index'>
        <AtNoticebar single icon='volume-plus' showMore onGotoMore={this.onGotoMore}>
          平台公告: 本平台只帮助各方老乡发布信息，不负责信息的真实性。
        </AtNoticebar>
        <View className='at-row at-row__justify--around tools'>
          {
            tools.map(item => {
              return (
                <View className='at-col' key={item.key}>
                  <View className='tools-item' onClick={this.onItemClick.bind(this, item)}>
                    <Image src={item.image}></Image>
                    <Text>{item.title}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default Index
