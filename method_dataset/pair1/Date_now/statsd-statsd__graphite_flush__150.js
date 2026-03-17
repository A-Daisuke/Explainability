var flush_stats = function graphite_flush(ts, metrics) {
  var starttime = Date.now();
  var numStats = 0;
  var key;
  var timer_data_key;
  var counters = metrics.counters;
  var gauges = metrics.gauges;
  var timers = metrics.timers;
  var sets = metrics.sets;
  var counter_rates = metrics.counter_rates;
  var timer_data = metrics.timer_data;
  var statsd_metrics = metrics.statsd_metrics;

  // Sanitize key for graphite if not done globally
  function sk(key) {
    if (globalKeySanitize) {
      return key;
    } else {
      return key.replace(/\s+/g, '_')
                .replace(/\//g, '-')
                .replace(/[^a-zA-Z_\-0-9\.;=]/g, '');
    }
  };

  function format(namespace, key) {
    var splitName = key.split(';');
    var keyName = sk(splitName[0]);
    var tags = splitName.length > 1 ? (';' + splitName.slice(1).join(';')) : '';

    return namespace.concat(keyName, [].slice.call(arguments, 2)).join('.') + globalSuffix + tags;
  }

  // Flatten all the different types of metrics into a single
  // collection so we can allow serialization to either the graphite
  // text and pickle formats.
  var stats = new Stats();

  for (key in counters) {
    var value = counters[key];
    var valuePerSecond = counter_rates[key]; // pre-calculated "per second" rate

    if (legacyNamespace === true) {
      stats.add(format(counterNamespace, key), valuePerSecond, ts);
      if (flush_counts) {
        stats.add(format(['stats_counts'], key), value, ts);
      }
    } else {
      stats.add(format(counterNamespace, key, 'rate'), valuePerSecond, ts);
      if (flush_counts) {
        stats.add(format(counterNamespace, key, 'count'), value, ts);
      }
    }

    numStats += 1;
  }

  for (key in timer_data) {
    for (timer_data_key in timer_data[key]) {
      if (typeof(timer_data[key][timer_data_key]) === 'number') {
        stats.add(format(timerNamespace, key, timer_data_key), timer_data[key][timer_data_key], ts);
      } else {
        for (var timer_data_sub_key in timer_data[key][timer_data_key]) {
          if (debug) {
            l.log(timer_data[key][timer_data_key][timer_data_sub_key].toString());
          }
          stats.add(format(timerNamespace, key, timer_data_key, timer_data_sub_key),
                    timer_data[key][timer_data_key][timer_data_sub_key], ts);
        }
      }
    }
    numStats += 1;
  }

  for (key in gauges) {
    stats.add(format(gaugesNamespace, key), gauges[key], ts);
    numStats += 1;
  }

  for (key in sets) {
    stats.add(format(setsNamespace, key, 'count'), sets[key].size(), ts);
    numStats += 1;
  }

  if (legacyNamespace === true) {
    stats.add(prefixStats + '.numStats' + globalSuffix, numStats, ts);
    stats.add('stats.' + prefixStats + '.graphiteStats.calculationtime' + globalSuffix, (Date.now() - starttime), ts);
    for (key in statsd_metrics) {
      stats.add('stats.' + prefixStats + '.' + key + globalSuffix, statsd_metrics[key], ts);
    }
  } else {
    stats.add(format(globalNamespace, prefixStats, 'numStats'), numStats, ts);
    stats.add(format(globalNamespace, prefixStats, 'graphiteStats', 'calculationtime'), (Date.now() - starttime) , ts);
    for (key in statsd_metrics) {
      stats.add(format(globalNamespace, prefixStats, key), statsd_metrics[key], ts);
    }
  }
  post_stats(stats);

  if (debug) {
   l.log("numStats: " + numStats);
  }
};
