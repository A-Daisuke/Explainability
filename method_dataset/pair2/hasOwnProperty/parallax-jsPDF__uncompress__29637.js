    var uncompress = API.__fontmetrics__.uncompress = function (data) {
      if (typeof data !== "string") {
        throw new Error("Invalid argument passed to uncompress.");
      }
      var output = {},
        sign = 1,
        stringparts,
        // undef. will be [] in string mode
        activeobject = output,
        parentchain = [],
        parent_key_pair,
        keyparts = "",
        valueparts = "",
        key,
        // undef. will be Truthy when Key is resolved.
        datalen = data.length - 1,
        // stripping ending }
        ch;
      for (var i = 1; i < datalen; i += 1) {
        // - { } ' are special.

        ch = data[i];
        if (ch == "'") {
          if (stringparts) {
            // end of string mode
            key = stringparts.join("");
            stringparts = undefined;
          } else {
            // start of string mode
            stringparts = [];
          }
        } else if (stringparts) {
          stringparts.push(ch);
        } else if (ch == "{") {
          // start of object
          parentchain.push([activeobject, key]);
          activeobject = {};
          key = undefined;
        } else if (ch == "}") {
          // end of object
          parent_key_pair = parentchain.pop();
          parent_key_pair[0][parent_key_pair[1]] = activeobject;
          key = undefined;
          activeobject = parent_key_pair[0];
        } else if (ch == "-") {
          sign = -1;
        } else {
          // must be number
          if (key === undefined) {
            if (mappingUncompress.hasOwnProperty(ch)) {
              keyparts += mappingUncompress[ch];
              key = parseInt(keyparts, 16) * sign;
              sign = +1;
              keyparts = "";
            } else {
              keyparts += ch;
            }
          } else {
            if (mappingUncompress.hasOwnProperty(ch)) {
              valueparts += mappingUncompress[ch];
              activeobject[key] = parseInt(valueparts, 16) * sign;
              sign = +1;
              key = undefined;
              valueparts = "";
            } else {
              valueparts += ch;
            }
          }
        }
      }
      return output;
    };
