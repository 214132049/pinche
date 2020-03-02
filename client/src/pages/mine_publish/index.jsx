import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtActivityIndicator, AtDivider } from 'taro-ui'
import { Card } from '@/components'
import Server from '@/utils/server'
import car from '@/assets/images/car.png'
import publish from '@/assets/images/publish.png'
import people from '@/assets/images/people.png'

import './index.scss'


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tools: [
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
    navigationBarTitleText: '我的发布',
    onReachBottomDistance: 100,
    enablePullDownRefresh: true
  }

  componentDidShow () {
  }

  componentDidHide () { }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh()
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
          type,
          ismine: true
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

  toDetail(id) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  toPublish() {
    Taro.switchTab({
      url: '/pages/publish/index'
    })
  }

  onItemClick (item) {
    switch(item.key) {
      case 2:
        this.toPublish()
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
        <View className='fab-btn' onClick={this.toPublish.bind(this)}>
          <Image src={publish}></Image>
          <Text>发布</Text>
        </View>
      </View>
    )
  }
}

export default Index
