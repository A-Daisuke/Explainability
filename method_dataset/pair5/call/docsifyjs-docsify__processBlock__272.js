function processBlock(blocks) {
  var m = null;
  var res = {};
  var lines = null;
  var children = null;
  var currentObj = null;

  var level = -1;

  var processedBlocks = [];

  var isMap = true;

  for (var j = 0, lenJ = blocks.length; j < lenJ; ++j) {
    if (level != -1 && level != blocks[j].level) continue;

    processedBlocks.push(j);

    level = blocks[j].level;
    lines = blocks[j].lines;
    children = blocks[j].children;
    currentObj = null;

    for (var i = 0, len = lines.length; i < len; ++i) {
      var line = lines[i];

      if ((m = line.match(regex['key']))) {
        var key = m[1];

        if (key[0] == '-') {
          key = key.replace(regex['item'], '');
          if (isMap) {
            isMap = false;
            if (typeof res.length === 'undefined') {
              res = [];
            }
          }
          if (currentObj != null) res.push(currentObj);
          currentObj = {};
          isMap = true;
        }

        if (typeof m[2] != 'undefined') {
          var value = m[2].replace(regex['trim'], '');
          if (value[0] == '&') {
            var nb = processBlock(children);
            if (currentObj != null) currentObj[key] = nb;
            else res[key] = nb;
            reference_blocks[value.substr(1)] = nb;
          } else if (value[0] == '|') {
            if (currentObj != null)
              currentObj[key] = processLiteralBlock(children.shift());
            else res[key] = processLiteralBlock(children.shift());
          } else if (value[0] == '*') {
            var v = value.substr(1);
            var no = {};

            if (typeof reference_blocks[v] == 'undefined') {
              errors.push("Reference '" + v + "' not found!");
            } else {
              for (var k in reference_blocks[v]) {
                no[k] = reference_blocks[v][k];
              }

              if (currentObj != null) currentObj[key] = no;
              else res[key] = no;
            }
          } else if (value[0] == '>') {
            if (currentObj != null)
              currentObj[key] = processFoldedBlock(children.shift());
            else res[key] = processFoldedBlock(children.shift());
          } else {
            if (currentObj != null) currentObj[key] = processValue(value);
            else res[key] = processValue(value);
          }
        } else {
          if (currentObj != null) currentObj[key] = processBlock(children);
          else res[key] = processBlock(children);
        }
      } else if (line.match(/^-\s*$/)) {
        if (isMap) {
          isMap = false;
          if (typeof res.length === 'undefined') {
            res = [];
          }
        }
        if (currentObj != null) res.push(currentObj);
        currentObj = {};
        isMap = true;
        continue;
      } else if ((m = line.match(/^-\s*(.*)/))) {
        if (currentObj != null) currentObj.push(processValue(m[1]));
        else {
          if (isMap) {
            isMap = false;
            if (typeof res.length === 'undefined') {
              res = [];
            }
          }
          res.push(processValue(m[1]));
        }
        continue;
      }
    }

    if (currentObj != null) {
      if (isMap) {
        isMap = false;
        if (typeof res.length === 'undefined') {
          res = [];
        }
      }
      res.push(currentObj);
    }
  }

  for (var j = processedBlocks.length - 1; j >= 0; --j) {
    blocks.splice.call(blocks, processedBlocks[j], 1);
  }

  return res;
}
