        function arraysToBytes(arr) {
          if (arr.length === 1 && arr[0] instanceof Uint8Array) {
            return arr[0];
          }

          var resultLength = 0;
          var i,
            ii = arr.length;
          var item, itemLength;

          for (i = 0; i < ii; i++) {
            item = arr[i];
            itemLength = arrayByteLength(item);
            resultLength += itemLength;
          }

          var pos = 0;
          var data = new Uint8Array(resultLength);

          for (i = 0; i < ii; i++) {
            item = arr[i];

            if (!(item instanceof Uint8Array)) {
              if (typeof item === "string") {
                item = stringToBytes(item);
              } else {
                item = new Uint8Array(item);
              }
            }

            itemLength = item.byteLength;
            data.set(item, pos);
            pos += itemLength;
          }

          return data;
        }
