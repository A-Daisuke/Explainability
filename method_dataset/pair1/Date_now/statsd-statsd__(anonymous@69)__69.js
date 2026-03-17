function __method_wrapper__() {
      graphite.on('connect', function() {
        var ts = Math.round(Date.now() / 1000);
        var namespace = globalNamespace.concat(prefixStats).join(".");
        stats.add(namespace + '.graphiteStats.last_exception' + globalSuffix, last_exception, ts);
        stats.add(namespace + '.graphiteStats.last_flush'     + globalSuffix, last_flush    , ts);
        stats.add(namespace + '.graphiteStats.flush_time'     + globalSuffix, flush_time    , ts);
        stats.add(namespace + '.graphiteStats.flush_length'   + globalSuffix, flush_length  , ts);
        var stats_payload = graphiteProtocol == 'pickle' ? stats.toPickle() : stats.toText();

        var starttime = Date.now();
        this.write(stats_payload);
        this.end();

        graphiteStats.flush_time = (Date.now() - starttime);
        graphiteStats.flush_length = stats_payload.length;
        graphiteStats.last_flush = Math.round(Date.now() / 1000);
      });

}
