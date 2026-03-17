function __method_wrapper__() {
    updateCron() {
      if (this.selectedInterval === 'custom') {
        if (!this.minuteIsValid || !this.hourIsValid || !this.selectedWeekdays.length) {
          this.cronExpression = null
          return
        }
        this.selectedWeekdays.sort()

        const daysOfWeekPiece = this.selectedWeekdays.length === 7 ? '*' : this.selectedWeekdays.join(',')
        this.cronExpression = `${this.selectedMinute} ${this.selectedHour} * * ${daysOfWeekPiece}`
      } else if (this.selectedInterval === 'daily') {
        if (!this.minuteIsValid || !this.hourIsValid) {
          this.cronExpression = null
          return
        }
        this.cronExpression = `${this.selectedMinute} ${this.selectedHour} * * *`
      } else {
        this.cronExpression = this.selectedInterval
      }

      this.customCronExpression = this.cronExpression
      this.validatedCron = this.cronExpression
      this.isValid = true
      this.customCronError = ''
      this.$emit('input', this.cronExpression)
    },

}
