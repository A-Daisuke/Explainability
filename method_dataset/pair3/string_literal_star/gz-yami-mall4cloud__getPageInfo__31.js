function __method_wrapper__() {
  getPageInfo: (to) => {
    const path = to.url
    const query = to.query
    const pageInfo = {}
    if (path === 'pages/index/index' || path === '*' || path === '' || path === '/') {
      // console.log('首页')
      pageInfo.pageId = 1
    } else if (path === 'pages/detail/detail') {
      // console.log('商品详情页')
      pageInfo.pageId = 2
      pageInfo.bid = query.spuId
    } else if (path === 'pages/category/category') {
      // console.log('分类')
      pageInfo.pageId = 3
    } else if (path === 'package-activities/pages/discount-list/discount-list') {
      // pageInfo.pageId = 7
      // console.log('满减')
    } else if (path === 'pages/cart/cart') {
      // console.log('购物车')
      pageInfo.pageId = 201
    } else if (path === 'package-user/pages/order-detail/order-detail') {
      // console.log('订单详情')
      pageInfo.pageId = 202
    } else if (path === 'package-user/pages/order/order') {
      // console.log('订单列表')
      pageInfo.pageId = 203
      pageInfo.bid = query.orderIds
    } else if (path === 'package-activities/pages/payment/payment') {
      // console.log('支付页面')
      pageInfo.pageId = 204
    } else if (path === 'pages/payment-result/payment-result') {
      // console.log('支付成功页面')
      pageInfo.pageId = 205
      pageInfo.bid = query.orderIds
      // 206  生成订单结算页面
    } else if (path === 'package-refund/pages/refund-detail/refund-detail') {
      // console.log('退款详情页')
      pageInfo.pageId = 207
      // 208 生成退款结算页面
    } else if (path === 'pages/my/my') {
      // console.log('个人中心')
      pageInfo.pageId = 301
    } else if (path === 'package-activities/pages/member-center/member-center') {
      // console.log('会员中心')
      pageInfo.pageId = 302
    }
    return pageInfo
  },

}
