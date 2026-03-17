    function getPictrue () {
      const data = {
        captchaType: captchaType.value,
        ts: Date.now() // 现在的时间戳
      }
      reqGet(data).then(res => {
        if (res.data.repCode === '0000') {
          backImgBase.value = res.data.repData.originalImageBase64
          blockBackImgBase.value = res.data.repData.jigsawImageBase64
          backToken.value = res.data.repData.token
          secretKey.value = res.data.repData.secretKey
        } else {
          tipWords.value = res.data.repMsg
        }
      })
    }
