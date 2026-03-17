class __C__ {
    init() {
      this.selectedInterval = 'custom'
      this.selectedHour = 0
      this.selectedMinute = 0
      this.selectedWeekdays = []

      if (!this.value) return
      const pieces = this.value.split(' ')
      if (pieces.length !== 5) {
        console.error('Invalid cron expression input', this.value)
        return
      }

      const intervalMatch = this.intervalOptions.find((opt) => opt.value === this.value)
      if (intervalMatch) {
        this.selectedInterval = this.value
      } else {
        var isCustomCron = false
        if (isNaN(pieces[0]) || isNaN(pieces[1])) {
          isCustomCron = true
        } else if (pieces[2] !== '*' || pieces[3] !== '*') {
          isCustomCron = true
        } else if (pieces[4] !== '*' && pieces[4].split(',').some((num) => isNaN(num))) {
          isCustomCron = true
        }

        if (isCustomCron) {
          this.showAdvancedView = true
        } else {
          if (pieces[4] === '*') this.selectedInterval = 'daily'

          this.selectedWeekdays = pieces[4] === '*' ? [0, 1, 2, 3, 4, 5, 6] : pieces[4].split(',').map((num) => Number(num))
          this.selectedHour = pieces[1]
          this.selectedMinute = pieces[0]
        }
      }
      this.cronExpression = this.value
      this.customCronExpression = this.value
    }

}
