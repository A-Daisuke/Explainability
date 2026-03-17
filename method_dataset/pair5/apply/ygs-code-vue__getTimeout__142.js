      function getTimeout(
                            delays, //延迟时间
                            durations //执行的时间
                          ) {
          console.log(delays)
          console.log(durations)
          console.log(delays.length < durations.length)


                              /* istanbul ignore next */
                              while (delays.length < durations.length) {
                                  delays = delays.concat(delays);
                              }

                         let max  = Math.max.apply(null, durations.map(function (d, i) {
                                  return toMs(d) + toMs(delays[i])
                              }))
          console.log(max);

          return max
      }
