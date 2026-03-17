function __method_wrapper__() {
      function(cmd, parameters, stream) {
        switch(cmd) {
          case "help":
            stream.write("Commands: stats, counters, timers, gauges, delcounters, deltimers, delgauges, health, config, quit\n\n");
            break;

          case "config":
            helpers.writeConfig(config, stream);
            break;

          case "health":
            if (parameters.length > 0) {
              const cmdaction = parameters[0].toLowerCase();
              if (cmdaction === 'up') {
                healthStatus = 'up';
              } else if (cmdaction === 'down') {
                healthStatus = 'down';
              }
            }
            stream.write("health: " + healthStatus + "\n");
            break;

          case "stats":
            const now    = Math.round(new Date().getTime() / 1000);
            const uptime = now - startup_time;

            stream.write("uptime: " + uptime + "\n");

            const stat_writer = function(group, metric, val) {
              let delta;

              if (metric.match("^last_")) {
                delta = now - val;
              }
              else {
                delta = val;
              }

              stream.write(group + "." + metric + ": " + delta + "\n");
            };

            // Loop through the base stats
            for (const group in stats) {
              for (const metric in stats[group]) {
                stat_writer(group, metric, stats[group][metric]);
              }
            }

            backendEvents.once('status', function() {
              stream.write("END\n\n");
            });

            // Let each backend contribute its status
            backendEvents.emit('status', function(err, name, stat, val) {
              if (err) {
                l.log("Failed to read stats for backend " +
                        name + ": " + err);
              } else {
                stat_writer(name, stat, val);
              }
            });

            break;

          case "counters":
            stream.write(util.inspect(counters) + "\n");
            stream.write("END\n\n");
            break;

          case "timers":
            stream.write(util.inspect(timers) + "\n");
            stream.write("END\n\n");
            break;

          case "gauges":
            stream.write(util.inspect(gauges) + "\n");
            stream.write("END\n\n");
            break;

          case "delcounters":
            mgmt.delete_stats(counters, parameters, stream);
            break;

          case "deltimers":
            mgmt.delete_stats(timers, parameters, stream);
            break;

          case "delgauges":
            mgmt.delete_stats(gauges, parameters, stream);
            break;

          case "quit":
            stream.end();
            break;

          default:
            stream.write("ERROR\n");
            break;
        }
      },

}
