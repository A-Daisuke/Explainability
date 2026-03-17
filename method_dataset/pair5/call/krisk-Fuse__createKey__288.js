function createKey(key) {
  var path = null;
  var id = null;
  var src = null;
  var weight = 1;
  var getFn = null;
  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(MISSING_KEY_PROPERTY('name'));
    }
    var name = key.name;
    src = name;
    if (hasOwn.call(key, 'weight')) {
      weight = key.weight;
      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
      }
    }
    path = createKeyPath(name);
    id = createKeyId(name);
    getFn = key.getFn;
  }
  return {
    path: path,
    id: id,
    weight: weight,
    src: src,
    getFn: getFn
  };
}
