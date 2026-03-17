function __method_wrapper__() {
    createProgress: (text, total = 0, start = 0, activityArgs = {}) => {
      let args = [text, total, start, activityArgs]

      if (pluginName && setErrorMap) {
        args = [...args, pluginName]
      }

      // eslint-disable-next-line prefer-spread
      const activity = reporter.createProgress.apply(reporter, args)

      const originalStart = activity.start
      const originalEnd = activity.end
      const originalDone = activity.done

      activity.start = () => {
        originalStart.apply(activity)
        runningActivities.add(activity)
      }

      activity.end = () => {
        originalEnd.apply(activity)
        runningActivities.delete(activity)
      }

      activity.done = () => {
        originalDone.apply(activity)
        runningActivities.delete(activity)
      }

      return activity
    },

}
