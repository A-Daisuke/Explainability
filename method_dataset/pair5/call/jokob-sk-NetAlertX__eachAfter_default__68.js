  function eachAfter_default(callback, that) {
    var node = this, nodes = [node], next = [], children2, i, n, index = -1;
    while (node = nodes.pop()) {
      next.push(node);
      if (children2 = node.children) {
        for (i = 0, n = children2.length; i < n; ++i) {
          nodes.push(children2[i]);
        }
      }
    }
    while (node = next.pop()) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }
