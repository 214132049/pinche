import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtNoticebar, AtActivityIndicator, AtDivider } from 'taro-ui'
import Server from '@/utils/server'
import { Card, NoData } from '@/components'

import './index.scss'


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
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
    this.refreshList('')
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

  onToDetail(id) {
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
    const { list, loading, loadend } = this.state
    return (
      <View className='page'>
        <View className='page-header'>
          <Navigator url='/pages/statement/index'>
            <AtNoticebar single marquee icon='volume-plus' speed={80}>
              平台公告: 本平台只帮助各方老乡发布信息，不负责信息的真实性，点击查看公告详情。
            </AtNoticebar>
          </Navigator>
        </View>
        <View className='page-body'>
          {
            list.map(item => {
              return <Card key={item._id} info={item} onToDetail={this.onToDetail.bind(this, item._id)}></Card>
            })
          }
          {
            loading ? <AtActivityIndicator mode='center' content='加载中...'></AtActivityIndicator> : ''
          }
          {
            loadend ? list.length ? <AtDivider className='divider' fontColor='#ccc' content='我是有底线的'></AtDivider> : <NoData showBtn></NoData> : ''
          }
        </View>
      </View>
    )
  }
}

export default Index
