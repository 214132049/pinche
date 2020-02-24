import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import refresh from '@/images/refresh.png'
import car from '@/images/car.png'
import publish from '@/images/publish.png'
import people from '@/images/people.png'

import './index.scss'


class Index extends Component {

  config = {
    navigationBarTitleText: '周沪拼车',
  }

  constructor(props) {
    super(props)
    this.state = {
      tools: [
        { title: '刷新', image: refresh },
        { title: '发布', image: publish },
        { title: '人找车', image: car },
        { title: '车找人', image: people },
      ]
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onGotoMore () {
    console.log('onGotoMore')
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
                <View className='at-col' key={item.title}>
                  <View className='tools-item'>
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
