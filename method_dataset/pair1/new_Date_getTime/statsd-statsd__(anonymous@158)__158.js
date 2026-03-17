class __C__ {
      function(cmd, parameters, stream) {
        switch(cmd) {
          case "help":
            stream.write("Commands: config, health, status, quit\n\n");
            break;

          case "config":
            helpers.writeConfig(config, stream);
            break;

          case "health":
            if (parameters.length > 0) {
              var cmdaction = parameters[0].toLowerCase();
              if (cmdaction === 'up') {
                healthStatus = 'up';
                if (forkCount > 0) {
                  // Notify the other forks
                  process.send({ healthStatus: healthStatus });
                }
              } else if (cmdaction === 'down') {
                healthStatus = 'down';
                if (forkCount > 0) {
                  // Notify the other forks
                  process.send({ healthStatus: healthStatus });
                }
              }
            }
            stream.write("health: " + healthStatus + "\n");
            break;

          case "status":
            var now    = Math.round(new Date().getTime() / 1000);
            var uptime = now - startup_time;

            stream.write("uptime: " + uptime + "\n");

            stream.write("nodes: ");
            ring.servers.forEach(function(server, index, array) {
              stream.write(server.string + " ");
            });
            stream.write("\n");
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
