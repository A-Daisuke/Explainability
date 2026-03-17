function __method_wrapper__() {
Vue.prototype.$parseCronExpression = (expression, context) => {
  if (!expression) return null
  const pieces = expression.split(' ')
  if (pieces.length !== 5) {
    return null
  }

  const commonPatterns = [
    {
      text: context.$strings.LabelIntervalEvery12Hours,
      value: '0 */12 * * *'
    },
    {
      text: context.$strings.LabelIntervalEvery6Hours,
      value: '0 */6 * * *'
    },
    {
      text: context.$strings.LabelIntervalEvery2Hours,
      value: '0 */2 * * *'
    },
    {
      text: context.$strings.LabelIntervalEveryHour,
      value: '0 * * * *'
    },
    {
      text: context.$strings.LabelIntervalEvery30Minutes,
      value: '*/30 * * * *'
    },
    {
      text: context.$strings.LabelIntervalEvery15Minutes,
      value: '*/15 * * * *'
    },
    {
      text: context.$strings.LabelIntervalEveryMinute,
      value: '* * * * *'
    }
  ]
  const patternMatch = commonPatterns.find((p) => p.value === expression)
  if (patternMatch) {
    return {
      description: patternMatch.text
    }
  }

  if (isNaN(pieces[0]) || isNaN(pieces[1])) {
    return null
  }
  if (pieces[2] !== '*' || pieces[3] !== '*') {
    return null
  }
  if (pieces[4] !== '*' && pieces[4].split(',').some((p) => isNaN(p))) {
    return null
  }

  const weekdays = context.$getDaysOfWeek()
  var weekdayText = 'day'
  if (pieces[4] !== '*')
    weekdayText = pieces[4]
      .split(',')
      .map((p) => weekdays[p])
      .join(', ')

  return {
    description: context.$getString('MessageScheduleRunEveryWeekdayAtTime', [weekdayText, `${pieces[1]}:${pieces[0].padStart(2, '0')}`])
  }
}

}
