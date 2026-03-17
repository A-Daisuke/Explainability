          function LZWStream(str, maybeLength, earlyChange) {
            this.str = str;
            this.dict = str.dict;
            this.cachedData = 0;
            this.bitsCached = 0;
            var maxLzwDictionarySize = 4096;
            var lzwState = {
              earlyChange: earlyChange,
              codeLength: 9,
              nextCode: 258,
              dictionaryValues: new Uint8Array(maxLzwDictionarySize),
              dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
              dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
              currentSequence: new Uint8Array(maxLzwDictionarySize),
              currentSequenceLength: 0
            };

            for (var i = 0; i < 256; ++i) {
              lzwState.dictionaryValues[i] = i;
              lzwState.dictionaryLengths[i] = 1;
            }

            this.lzwState = lzwState;
            DecodeStream.call(this, maybeLength);
          }
