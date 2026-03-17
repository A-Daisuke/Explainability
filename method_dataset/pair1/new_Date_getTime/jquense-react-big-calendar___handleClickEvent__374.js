class __C__ {
  _handleClickEvent(e) {
    const { pageX, pageY, clientX, clientY } = getEventCoordinates(e)
    const now = new Date().getTime()

    if (
      this._lastClickData &&
      now - this._lastClickData.timestamp < clickInterval
    ) {
      // Double click event
      this._lastClickData = null
      return this.emit('doubleClick', {
        x: pageX,
        y: pageY,
        clientX: clientX,
        clientY: clientY,
      })
    }

    // Click event
    this._lastClickData = {
      timestamp: now,
    }
    return this.emit('click', {
      x: pageX,
      y: pageY,
      clientX: clientX,
      clientY: clientY,
    })
  }

}
