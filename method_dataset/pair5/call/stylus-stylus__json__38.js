function json(path, local, namePrefix){
  utils.assertString(path, 'path');

  // lookup
  path = path.string;
  var found = utils.lookup(path, this.options.paths, this.options.filename)
    , options = (local && 'object' == local.nodeName) && local;

  if (!found) {
    // optional JSON file
    if (options && options.get('optional').toBoolean().isTrue) {
      return nodes.null;
    }
    throw new Error('failed to locate .json file ' + path);
  }

  // read
  var json = JSON.parse(readFile(found, 'utf8'));

  if (options) {
    return convert(json, options);
  } else {
    oldJson.call(this, json, local, namePrefix);
  }

  function convert(obj, options){
    var ret = new nodes.Object()
      , leaveStrings = options.get('leave-strings').toBoolean();

    for (var key in obj) {
      var val = obj[key];
      if ('object' == typeof val) {
        ret.set(key, convert(val, options));
      } else {
        val = utils.coerce(val);
        if ('string' == val.nodeName && leaveStrings.isFalse) {
          val = utils.parseString(val.string);
        }
        ret.set(key, val);
      }
    }
    return ret;
  }
};
