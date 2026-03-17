    const handlePacket = function (msg, rinfo) {
      backendEvents.emit('packet', msg, rinfo);
      counters[packets_received]++;
      let metrics;
      const packet_data = msg.toString();
      if (packet_data.indexOf("\n") > -1) {
        metrics = packet_data.split("\n");
      } else {
        metrics = [ packet_data ] ;
      }

      for (const midx in metrics) {
        if (metrics[midx].length === 0) {
          continue;
        }

        counters[metrics_received]++;
        if (config.dumpMessages) {
          l.log(metrics[midx].toString());
        }

        let bits = metrics[midx].toString().split('|#');
        let tags = [];
        if (bits.length > 1 && bits[1].length > 0) {
          tags = bits[1].split(',');
        }
        bits = bits[0].split(':');
        let key = bits.shift();
        if (tags.length > 0) {
          key += ';' + tags.map(function(tag) {
            return tag.replace(';', '_').replace(':', '=');
          }).join(';');
        }
        key = sanitizeKeyName(key);

        if (keyFlushInterval > 0) {
          if (! keyCounter[key]) {
            keyCounter[key] = 0;
          }
          keyCounter[key] += 1;
        }

        if (bits.length === 0) {
          bits.push("1");
        }

        for (let i = 0; i < bits.length; i++) {
          let sampleRate = 1;
          const fields = bits[i].split("|");
          if (!helpers.is_valid_packet(fields)) {
              l.log('Bad line: ' + fields + ' in msg "' + metrics[midx] +'"');
              counters[bad_lines_seen]++;
              stats.messages.bad_lines_seen++;
              continue;
          }
          if (fields[2]) {
            sampleRate = Number(fields[2].match(/^@([\d\.]+)/)[1]);
          }

          const metric_type = fields[1].trim();
          if (metric_type === "ms") {
            if (! timers[key]) {
              timers[key] = [];
              timer_counters[key] = 0;
            }
            timers[key].push(Number(fields[0] || 0));
            timer_counters[key] += (1 / sampleRate);
          } else if (metric_type === "g") {
            // if deleteGauges is true reset the max TTL to its initial value
            if (conf.deleteGauges) {
              gaugesTTL[key] = conf.gaugesMaxTTL;
            }
            if (gauges[key] && fields[0].match(/^[-+]/)) {
              gauges[key] += Number(fields[0] || 0);
            } else {
              gauges[key] = Number(fields[0] || 0);
            }
          } else if (metric_type === "s") {
            if (! sets[key]) {
              sets[key] = new set.Set();
            }
            sets[key].insert(fields[0] || '0');
          } else {
            if (! counters[key]) {
              counters[key] = 0;
            }
            counters[key] += Number(fields[0] || 1) * (1 / sampleRate);
          }
        }
      }

      stats.messages.last_msg_seen = Math.round(new Date().getTime() / 1000);
    };
