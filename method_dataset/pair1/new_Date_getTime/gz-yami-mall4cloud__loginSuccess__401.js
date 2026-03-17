function __method_wrapper__() {
  loginSuccess: async function (loginRes, isRefreshToken) {
    uni.setStorageSync('cloudToken', loginRes.accessToken)
    uni.setStorageSync('cloudLoginResult', loginRes) // 保存整个登录数据
    const expiresTimeStamp = loginRes.expiresIn * 1000 / 2 + new Date().getTime()
    // 缓存token的过期时间
    uni.setStorageSync('cloudExpiresTimeStamp', expiresTimeStamp)
    // 请求用户信息
    const userInfo = await this.getUserInfo()
    uni.setStorageSync('cloudUserDetails', userInfo)

    // 还原全局 正在登录状态
    util.resetLoginSts()
    // 请求购物车数量
    cartCount.getCartCount()

    // 登录成功后，更新通联支付配置
    util.getAllinpayConfig()

    // 若为刷新token的登录，则不需要跳转到上一页面
    if (isRefreshToken) {
      // console.log('刷新token登录成功，不需要跳转到上一页面')
      return
    }
    const routeUrlAfterLogin = uni.getStorageSync('cloudRouteUrlAfterLogin')
    const pages = getCurrentPages()
    if (pages[pages.length - 1].route === 'pages/detail/detail' || pages[pages.length - 1].route === 'package-activities/pages/group-detail/group-detail') {
      // 如果当前页面是商品详情页或拼团详情页，则不跳转其它页面
      return
    }
    const prevPage = pages[pages.length - 2]
    if (!prevPage) {
      // 当前页面为首页则不跳转
      if (pages[pages.length - 1].route === 'pages/index/index') {
        return
      }

      uni.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    // 判断上一页面是否为tabbar页面 (首页和分类页无需登录接口)
    const isTabbar = prevPage.route === 'pages/user/user' || prevPage.route === 'pages/basket/basket'
    if (prevPage.route === 'package-activities/pages/live-room/live-room' || prevPage.route === 'package-activities/pages/wx-player/wx-player') {
      uni.setStorageSync('cloudLiveRoomReload', true)
    }
    if (isTabbar) {
      uni.switchTab({
        url: '/' + prevPage.route
      })
    } else {
      // 非tabbar页面
      let backDelata = 0
      pages.forEach((page, index) => {
        if (page.$page.fullPath === routeUrlAfterLogin) {
          backDelata = pages.length - index - 1
        }
      })
      if (backDelata) {
        uni.navigateBack({
          delta: backDelata
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  },

}
