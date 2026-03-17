function __method_wrapper__() {
  refreshToken: () => {
    const refreshToken = uni.getStorageSync('cloudLoginResult').refreshToken
    const expiresTimeStamp = uni.getStorageSync('cloudExpiresTimeStamp')
    if (refreshToken && expiresTimeStamp && expiresTimeStamp < new Date().getTime()) {
      getApp().globalData.isLanding = true
      const params = {
        url: '/mall4cloud_auth/ua/token/refresh',
        method: 'POST',
        isRefreshing: true,
        data: {
          refreshToken
        }
      }
      http.request(params).then(res => {
        util.resetLoginSts()
        util.loginSuccess(res, true)
      }).catch(() => {
        uni.hideLoading()
        util.resetLoginSts()
        // 清除refreshToken 过期时间
        uni.removeStorageSync('cloudExpiresTimeStamp')
      })
    }
  },

}
