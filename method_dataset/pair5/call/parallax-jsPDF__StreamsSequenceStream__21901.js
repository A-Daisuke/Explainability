          function StreamsSequenceStream(streams) {
            this.streams = streams;
            var maybeLength = 0;

            for (var i = 0, ii = streams.length; i < ii; i++) {
              var stream = streams[i];

              if (stream instanceof DecodeStream) {
                maybeLength += stream._rawMinBufferLength;
              } else {
                maybeLength += stream.length;
              }
            }

            DecodeStream.call(this, maybeLength);
          }
