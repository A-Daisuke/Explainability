function __method_wrapper__() {
    activityTimer: (text, activityArgs = {}) => {
      let args = [text, activityArgs]

      if (pluginName && setErrorMap) {
        args = [...args, pluginName]
      }

      // eslint-disable-next-line prefer-spread
      const activity = reporter.activityTimer.apply(reporter, args)

      const originalStart = activity.start
      const originalEnd = activity.end

      activity.start = () => {
        originalStart.apply(activity)
        runningActivities.add(activity)
      }

      activity.end = () => {
        originalEnd.apply(activity)
        runningActivities.delete(activity)
      }

      return activity
    },

}
