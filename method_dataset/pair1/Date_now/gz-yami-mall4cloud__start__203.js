    function start (e) {
      e = e || window.event
      let x
      if (!e.touches) { // 兼容PC端
        x = e.clientX
      } else { // 兼容移动端
        x = e.touches[0].pageX
      }
      startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left)
      startMoveTime.value = Date.now() // 开始滑动的时间
      if (isEnd.value === false) {
        text.value = ''
        moveBlockBackgroundColor.value = '#337ab7'
        leftBarBorderColor.value = '#337AB7'
        iconColor.value = '#fff'
        e.stopPropagation()
        status.value = true
      }
    }
