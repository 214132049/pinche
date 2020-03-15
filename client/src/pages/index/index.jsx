import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtDivider } from 'taro-ui'
import Server from '@/utils/server'
import { Card, NoData, SearchBar } from '@/components'

import './index.scss'


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      pagesize: 10,
      pageno: 1,
      filters: {},
      loadend: false,
      loading: false,
      searchValue: {}
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
    Taro.stopPullDownRefresh()
    this.refreshList()
  }

  onReachBottom() {
    this.onGetPublishMessage()
  }

  async onGetPublishMessage() {
    let { loading, list, pageno, pagesize, filters, loadend } = this.state
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
          ...filters
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

  refreshList(data={}) {
    let filters = {}
    for(let key in data) {
      if (data[key]) {
        filters[key] = data[key]
      }
    }
    this.setState({
      list: [],
      pageno: 1,
      loadend: false,
      filters
    }, () => this.onGetPublishMessage())
  }

  onClearSearch () {
    this.setState({
      searchValue: {}
    })
    this.refreshList()
  }

  toSearch() {
    Taro.navigateTo({
      url: '/pages/search/index',
      events: {
        acceptFormData: (data) => {
          this.setState({
            searchValue: data
          })
          this.refreshList(data)
        }
      },
      success: (res) => {
        res.eventChannel.emit('setFromData', this.state.searchValue)
      }
    })
  }

  render () {
    const { list, loading, loadend, searchValue } = this.state
    return (
      <View className='page'>
        <View className='page-header'>
          <SearchBar
            onClick={this.toSearch.bind(this)}
            onClear={this.onClearSearch.bind(this)}
            value={searchValue}
          />
        </View>
        <View className='page-body'>
          {
            list.map(item => {
              return <Card
                key={item._id}
                info={item}
                onToDetail={this.onToDetail.bind(this, item._id)}
              />
            })
          }
          {
            loading && list.length ? <AtActivityIndicator mode='center' content='加载中...' /> : ''
          }
          {
            loadend ? list.length ?
              <AtDivider className='divider' fontColor='#ccc' content='我是有底线的' /> :
              <NoData showBtn /> : ''
          }
        </View>
      </View>
    )
  }
}

export default Index
