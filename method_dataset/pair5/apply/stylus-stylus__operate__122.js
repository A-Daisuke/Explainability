class __C__ {
  operate(op, right) {
    switch (op) {
      case '%':
        var expr = new nodes.Expression;
        expr.push(this);

        // constructargs
        var args = 'expression' == right.nodeName
          ? utils.unwrap(right).nodes
          : [right];

        // apply
        return sprintf.apply(null, [expr].concat(args));
      case '+':
        var expr = new nodes.Expression;
        expr.push(new String(this.val + this.coerce(right).val));
        return expr;
      default:
        return super.operate(op, right);
    }
  };

}
