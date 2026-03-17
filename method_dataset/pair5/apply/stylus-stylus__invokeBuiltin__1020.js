function __method_wrapper__() {
  invokeBuiltin(fn, args) {
    // Map arguments to first node
    // providing a nicer js api for
    // BIFs. Functions may specify that
    // they wish to accept full expressions
    // via .raw
    if (fn.raw) {
      args = args.nodes;
    } else {
      if (!fn.params) {
        fn.params = utils.params(fn);
      }
      args = fn.params.reduce(function (ret, param) {
        var arg = args.map[param] || args.nodes.shift()
        if (arg) {
          arg = utils.unwrap(arg);
          var len = arg.nodes.length;
          if (len > 1) {
            for (var i = 0; i < len; ++i) {
              ret.push(utils.unwrap(arg.nodes[i].first));
            }
          } else {
            ret.push(arg.first);
          }
        }
        return ret;
      }, []);
    }

    // Invoke the BIF
    var body = utils.coerce(fn.apply(this, args));

    // Always wrapping allows js functions
    // to return several values with a single
    // Expression node
    var expr = new nodes.Expression;
    expr.push(body);
    body = expr;

    // Invoke
    return this.invoke(body);
  };

}
