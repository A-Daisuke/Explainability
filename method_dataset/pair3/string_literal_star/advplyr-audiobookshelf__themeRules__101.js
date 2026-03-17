class __C__ {
    themeRules() {
      const theme = this.ereaderSettings.theme
      const isDark = theme === 'dark'
      const isSepia = theme === 'sepia'

      const fontColor = isDark
        ? '#fff'
        : isSepia
        ? '#5b4636'
        : '#000'

      const backgroundColor = isDark
        ? 'rgb(35 35 35)'
        : isSepia
        ? 'rgb(244, 236, 216)'
        : 'rgb(255, 255, 255)'

      const lineSpacing = this.ereaderSettings.lineSpacing / 100
      const fontScale   = this.ereaderSettings.fontScale   / 100
      const textStroke  = this.ereaderSettings.textStroke  / 100

      return {
        '*': {
          color: `${fontColor}!important`,
          'background-color': `${backgroundColor}!important`,
          'line-height': `${lineSpacing * fontScale}rem!important`,
          '-webkit-text-stroke': `${textStroke}px ${fontColor}!important`
        },
        a: {
          color: `${fontColor}!important`
        }
      }
    }

}
