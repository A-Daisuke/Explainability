function __method_wrapper__() {
  setUp: function (callback) {
    this.time_stamp = Math.round(new Date().getTime() / 1000);

    var counters = {};
    var gauges = {};
    var timers = {};
    var timer_counters = {};
    var sets = {};
    var pctThreshold = null;
    var calculatedTimerMetrics = [];

    this.metrics = {
      counters: counters,
      gauges: gauges,
      timers: timers,
      timer_counters: timer_counters,
      sets: sets,
      pctThreshold: pctThreshold
    }
    callback();
  },

}
