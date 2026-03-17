function __method_wrapper__() {
      }).then(data => {
        if (data.data && data.data.expire_time) {
          // 根据过期时间计算天数设置
          const now = Math.floor(Date.now() / 1000) // 当前时间戳（秒）
          const expireTime = data.data.expire_time

          if (expireTime > 0) {
            const diffDays = Math.round((expireTime - now) / (24 * 60 * 60))

            // 根据剩余天数匹配最接近的选项
            if (diffDays <= 1) {
              this.expireTime = 1 // 一天
            } else if (diffDays <= 7) {
              this.expireTime = 7 // 七天
            } else if (diffDays <= 30) {
              this.expireTime = 30 // 一个月
            } else if (diffDays <= 180) {
              this.expireTime = 180 // 半年
            } else {
              this.expireTime = 0 // 如果不匹配任何选项，设为永久
            }
          } else {
            this.expireTime = 0 // 如果expire_time为0，表示永久有效
          }
        }
      })

}
