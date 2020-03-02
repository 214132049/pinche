import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Navigator, ScrollView } from '@tarojs/components'
import { AtNoticebar, AtActivityIndicator, AtDivider } from 'taro-ui'
import refresh from '@/assets/images/refresh.png'
import car from '@/assets/images/car.png'
import publish from '@/assets/images/publish.png'
import people from '@/assets/images/people.png'
import Server from '@/utils/server'
import { Card } from '@/components'

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
      ],
      list: [],
      pagesize: 10,
      pageno: 1,
      type: '',
      loadend: false,
      loading: false
    }
  }

  async componentDidMount () {
    this.onGetPublishMessage()
  }

  config = {
    navigationBarTitleText: 'e拼车',
    onReachBottomDistance: 100,
    enablePullDownRefresh: true
  }

  componentDidShow () {
  }

  componentDidHide () { }

  onPullDownRefresh() {
    this.refreshList('')
  }

  onReachBottom() {
    this.onGetPublishMessage()
  }

  async onGetPublishMessage() {
    let { loading, list, pageno, pagesize, type, loadend } = this.state
    if (loading || loadend) {
      return
    }
    if (!loading) {
      this.setState({
        loading: true
      })
    } 
    try {
      const { data, totalpage } = await Server({
        name: 'get_publish',
        data: {
          pagesize,
          pageno,
          type
        },
        noloading: true
      })
      pageno = pageno + 1 
      this.setState({
        list: list.concat(data),
        loading: false,
        pageno,
        loadend: pageno > totalpage
      })
    } catch(e) {
      this.setState({
        loading: false
      })
      Taro.showToast({
        icon: 'none',
        title: '加载失败，请重试'
      })
    }
  }

  onItemClick (item) {
    switch(item.key) {
      case 1:
        this.refreshList('')
        break
      case 2:
        Taro.switchTab({
          url: '/pages/publish/index'
        })
        break
      case 3:
      case 4:
        const type = item.key === 3 ? '1' : '2'
        this.refreshList(type)
        break
      default: 
        break
    }
  }

  toDetail(id) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  refreshList(type) {
    this.setState({
      list: [],
      pageno: 1,
      loadend: false,
      type
    }, () => this.onGetPublishMessage())
  }

  render () {
    const { tools, list, loading, loadend } = this.state
    return (
      <View className='page'>
        <View className='page-header'>
          <AtNoticebar single marquee icon='volume-plus' speed={80}>
            <Navigator url='/pages/statement/index'>平台公告: 本平台只帮助各方老乡发布信息，不负责信息的真实性，点击查看公告详情。</Navigator>
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
        <View className='page-body'>
          {
            list.map(item => {
              return <Card key={item._id} info={item} onClick={this.toDetail.bind(this, item._id)}></Card>
            })
          }
          {
            loading ? <AtActivityIndicator mode='center' content='加载中...'></AtActivityIndicator> : ''
          }
          {
            loadend ? <AtDivider className='divider' fontColor='#ccc' content='我是有底线的'></AtDivider> : ''
          }
        </View>
      </View>
    )
  }
}

export default Index
