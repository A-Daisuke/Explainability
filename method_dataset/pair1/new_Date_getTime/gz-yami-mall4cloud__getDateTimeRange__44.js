export function getDateTimeRange () {
  let time = new Date().getTime()
  let currentHour = parseInt(getParseTime(time, '{h}'))
  let currentMinute = parseInt(getParseTime(time, '{i}'))
  if (currentMinute >= 30) {
    if (currentHour === 23) {
      currentHour = '00'
      currentMinute = ':00'
      time += 24 * 60 * 60 * 1000
    } else {
      currentHour = currentHour + 1
      currentMinute = ':00'
    }
  } else {
    currentMinute = ':30'
  }
  currentHour = currentHour < 10 ? '0' + currentHour : currentHour + ''
  const currentTime = currentHour + currentMinute
  return {
    startTime: getParseTime(time, '{y}-{m}-{d}'),
    endTime: getParseTime(time + 24 * 60 * 60 * 1000, '{y}-{m}-{d}'),
    currentTime
  }
}
