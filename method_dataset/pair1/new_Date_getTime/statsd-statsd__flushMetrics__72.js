function flushMetrics() {
  const time_stamp = Math.round(new Date().getTime() / 1000);
  if (old_timestamp > 0) {
    gauges[timestamp_lag_namespace] = (time_stamp - old_timestamp - (Number(conf.flushInterval)/1000));
  }
  old_timestamp = time_stamp;

  const metrics_hash = {
    counters: counters,
    gauges: gauges,
    timers: timers,
    timer_counters: timer_counters,
    sets: sets,
    counter_rates: counter_rates,
    timer_data: timer_data,
    pctThreshold: pctThreshold,
    histogram: conf.histogram
  };

  // After all listeners, reset the stats
  backendEvents.once('flush', function clear_metrics(ts, metrics) {

    // Clear the counters
    conf.deleteCounters = conf.deleteCounters || false;
    for (const counter_key in metrics.counters) {
      if (conf.deleteCounters) {
        if ((counter_key.indexOf("packets_received") != -1) ||
            (counter_key.indexOf("metrics_received") != -1) ||
            (counter_key.indexOf("bad_lines_seen") != -1)) {
          metrics.counters[counter_key] = 0;
        } else {
         delete(metrics.counters[counter_key]);
        }
      } else {
        metrics.counters[counter_key] = 0;
      }
    }

    // Clear the timers
    conf.deleteTimers = conf.deleteTimers || false;
    for (const timer_key in metrics.timers) {
      if (conf.deleteTimers) {
        delete(metrics.timers[timer_key]);
        delete(metrics.timer_counters[timer_key]);
      } else {
        metrics.timers[timer_key] = [];
        metrics.timer_counters[timer_key] = 0;
     }
    }

    // Clear the sets
    conf.deleteSets = conf.deleteSets || false;
    for (const set_key in metrics.sets) {
      if (conf.deleteSets) {
        delete(metrics.sets[set_key]);
      } else {
        metrics.sets[set_key] = new set.Set();
      }
    }

    // Normally gauges are not reset.  so if we don't delete them, continue to persist previous value
    conf.deleteGauges = conf.deleteGauges || false;
    if (conf.deleteGauges) {
      for (const gauge_key in gaugesTTL) {
        gaugesTTL[gauge_key]--;

        // if the gauge has been idle for more than the allowed TTL cycles delete it
        if (gaugesTTL[gauge_key] < 1) {
          delete(metrics.gauges[gauge_key]);
          delete(gaugesTTL[gauge_key]);
        }
      }
    }
  });

  pm.process_metrics(metrics_hash, conf.calculatedTimerMetrics, flushInterval, time_stamp, function emitFlush(metrics) {
    backendEvents.emit('flush', time_stamp, metrics);
  });

  // Performing this setTimeout at the end of this method rather than the beginning
  // helps ensure we adapt to negative clock skew by letting the method's latency
  // introduce a short delay that should more than compensate.
  setTimeout(flushMetrics, getFlushTimeout(flushInterval));
}
