function __method_wrapper__() {
          StreamsSequenceStream.prototype.getBaseStreams = function StreamsSequenceStream_getBaseStreams() {
            var baseStreams = [];

            for (var i = 0, ii = this.streams.length; i < ii; i++) {
              var stream = this.streams[i];

              if (stream.getBaseStreams) {
                baseStreams.push.apply(
                  baseStreams,
                  _toConsumableArray(stream.getBaseStreams())
                );
              }
            }

            return baseStreams;
          };

}
