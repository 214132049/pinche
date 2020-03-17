import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtActivityIndicator, AtDivider } from 'taro-ui'
import { Card, NoData } from '@/components'
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
        { key: '1', title: '找车主', image: car },
        { key: '2', title: '找乘客', image: people },
      ],
      list: [],
      pagesize: 10,
      pageno: 1,
      type: '1',
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
    this.refreshList('1')
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
      const { data } = await Server({
        name: 'get_publish',
        data: {
          pagesize,
          pageno,
          type,
          ismine: true
        },
        noloading: !!list.length
      })
      pageno = pageno + 1
      this.setState({
        list: list.concat(data),
        loading: false,
        pageno,
        loadend: pagesize > data.length
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

  onToPublish() {
    Taro.switchTab({
      url: '/pages/publish_type/index'
    })
  }

  onToEdit({_id, type}) {
    console.log(_id)
    Taro.navigateTo({
      url: `/pages/publish/index?id=${_id}&type=${type}`
    })
  }

  onToDelete(id) {
    Taro.showModal({
      title: '',
      content: '确定删除这条信息吗？'
    }).then(({ confirm }) => {
      if (confirm) {
        this.deletePublish(id)
      }
    })
  }

  onItemClick (item) {
    this.refreshList(item.key)
  }

  refreshList(type) {
    this.setState({
      list: [],
      pageno: 1,
      loadend: false,
      type
    }, () => this.onGetPublishMessage())
  }

  async deletePublish (id) {
    try {
      await Server({
        name: 'del_publish',
        data: {
          id
        },
        loadingTitle: '删除中'
      })
      this.refreshList(this.state.type)
      Taro.showToast({
        icon: 'success',
        title: '删除成功'
      })
    } catch(e) {
      Taro.showToast({
        icon: 'error',
        title: '删除失败，请重试'
      })
    }
  }

  render () {
    const { tools, list, loading, loadend, type } = this.state
    return (
      <View className='page'>
        <View className='page-header'>
          <View className='at-row at-row__justify--around tools'>
            {
              tools.map(item => {
                return (
                  <View className='at-col' key={item.key}>
                    <View
                      className={type == item.key ? 'tools-item active' : 'tools-item'}
                      onClick={this.onItemClick.bind(this, item)}
                    >
                      <Image src={item.image} />
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
              return <Card
                key={item._id}
                info={item}
                ismine='true'
                onToDetail={this.onToDetail.bind(this, item._id)}
                onToDelete={this.onToDelete.bind(this, item._id)}
                onToEdit={this.onToEdit.bind(this, item)}
              />
            })
          }
          {
            loading && list.length ? <AtActivityIndicator mode='center' content='加载中...' /> : ''
          }
          {
            loadend ? list.length ?
              <AtDivider className='divider' fontColor='#ccc' content='我是有底线的' /> :
              <NoData tip='您暂未发布此类信息' /> : ''
          }
        </View>
        <View className='fab-btn' onClick={this.onToPublish}>
          <Image src={publish} />
          <Text>发布</Text>
        </View>
      </View>
    )
  }
}

export default Index
