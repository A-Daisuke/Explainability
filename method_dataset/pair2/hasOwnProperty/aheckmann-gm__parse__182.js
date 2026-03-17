  function parse (stdout, self) {
    // normalize
    var parts = (stdout||"").trim().replace(/\r\n|\r/g, "\n").split("\n");

    // skip the first line (its just the filename)
    parts.shift();

    try {
      var len = parts.length
        , rgx1 = /^( *)(.+?): (.*)$/ // key: val
        , rgx2 = /^( *)(.+?):$/      // key: begin nested object
        , out = { indent: {} }
        , level = null
        , lastkey
        , i = 0
        , res
        , o

      for (; i < len; ++i) {
        res = rgx1.exec(parts[i]) || rgx2.exec(parts[i]);
        if (!res) continue;

        var indent = res[1].length
          , key = res[2] ? res[2].trim() : '';

        if ('Image' == key || 'Warning' == key) continue;

        var val = res[3] ? res[3].trim() : null;

        // first iteration?
        if (null === level) {
          level = indent;
          o = out.root = out.indent[level] = self.data;
        } else if (indent < level) {
          // outdent
          if (!(indent in out.indent)) {
            continue;
          }
          o = out.indent[indent];
        } else if (indent > level) {
          // dropping into a nested object
          out.indent[level] = o;
          // weird format, key/val pair with nested children. discard the val
          o = o[lastkey] = {};
        }

        level = indent;

        if (val) {
          // if previous key was exist and we got the same key
          // cast it to an array.
          if(o.hasOwnProperty(key)){
            // cast it to an array and dont forget the previous value
            if(!Array.isArray(o[key])){
              var tmp = o[key];
              o[key] = [tmp];
            }

            // set value
            o[key].push(val);
          } else {
            o[key] = val;
          }

          if (key in helper) {
            helper[key](o, val);
          }
        }

        lastkey = key;
      }

    } catch (err) {
      err.message = err.message + "\n\n  Identify stdout:\n  " + stdout;
      return err;
    }
  }
