    function end () {
      endMovetime.value = Date.now()
      // 判断是否重合
      if (status.value && isEnd.value === false) {
        let moveLeftDistance = Number.parseInt((moveBlockLeft.value || '').replace('px', ''))
        moveLeftDistance = moveLeftDistance * 310 / Number.parseInt(setSize.imgWidth)
        const data = {
          captchaType: captchaType.value,
          pointJson: secretKey.value ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value) : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: backToken.value
        }
        reqCheck(data).then(res => {
          if (res.data.repCode === '0000') {
            moveBlockBackgroundColor.value = '#5cb85c'
            leftBarBorderColor.value = '#5cb85c'
            iconColor.value = '#fff'
            iconClass.value = 'icon-check'
            showRefresh.value = false
            isEnd.value = true
            if (mode.value === 'pop') {
              setTimeout(() => {
                proxy.$parent.clickShow = false
                refresh()
              }, 1500)
            }
            passFlag.value = true
            tipWords.value = `${((endMovetime.value - startMoveTime.value) / 1000).toFixed(2)}s验证成功`
            const captchaVerification = secretKey.value ? aesEncrypt(`${backToken.value}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`, secretKey.value) : `${backToken.value}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`
            setTimeout(() => {
              tipWords.value = ''
              proxy.$parent.closeBox()
              proxy.$parent.$emit('success', { captchaVerification })
            }, 1000)
          } else {
            moveBlockBackgroundColor.value = '#d9534f'
            leftBarBorderColor.value = '#d9534f'
            iconColor.value = '#fff'
            iconClass.value = 'icon-close'
            passFlag.value = false
            setTimeout(() => {
              refresh()
            }, 1000)
            proxy.$parent.$emit('error', proxy)
            tipWords.value = '验证失败'
            setTimeout(() => {
              tipWords.value = ''
            }, 1000)
          }
        })
        status.value = false
      }
    }
