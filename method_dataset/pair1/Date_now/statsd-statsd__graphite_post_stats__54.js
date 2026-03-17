var post_stats = function graphite_post_stats(stats) {
  var last_flush = graphiteStats.last_flush || 0;
  var last_exception = graphiteStats.last_exception || 0;
  var flush_time = graphiteStats.flush_time || 0;
  var flush_length = graphiteStats.flush_length || 0;

  if (graphiteHost) {
    try {
      var port = graphiteProtocol == 'pickle' ? graphitePicklePort : graphitePort;
      var graphite = net.createConnection(port, graphiteHost);
      graphite.addListener('error', function(connectionException){
        if (debug) {
          l.log(connectionException);
        }
      });
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
    } catch(e){
      if (debug) {
        l.log(e);
      }
      graphiteStats.last_exception = Math.round(Date.now() / 1000);
    }
  }
};
