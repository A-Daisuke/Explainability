const getCountDown = () => {
  const nowTime = new Date().getTime() // 现在时间（时间戳）
  const endTime = new Date(Data.endTime.replace(/-/g, '/')).getTime() // 结束时间（时间戳）
  const time = (endTime - nowTime) / 1000 // 距离结束的毫秒数
  // 获取时、分、秒
  let hou = parseInt(time % (60 * 60 * 24) / 3600)
  let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
  let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
  hou = timeFormin(hou)
  min = timeFormin(min)
  sec = timeFormin(sec)
  Data.hou = timeFormat(hou)
  Data.min = timeFormat(min)
  Data.sec = timeFormat(sec)
  // 每1000ms刷新一次
  if (time > 0) {
    Data.countDown = true
    Data.timer = setTimeout(Data.getCountDown, 1000)
  } else {
    Data.countDown = false
    uni.navigateTo({
      url: '/pages/order/order'
    })
    // this.$Router.push('/pages/orderList/orderList')
  }
}
