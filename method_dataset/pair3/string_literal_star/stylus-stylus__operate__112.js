class __C__ {
  operate(op, right) {
    var type = this.type || right.first.type;

    // swap color
    if ('rgba' == right.nodeName || 'hsla' == right.nodeName) {
      return right.operate(op, this);
    }

    // operate
    if (this.shouldCoerce(op)) {
      right = right.first;
      // percentages
      if ('%' != this.type && ('-' == op || '+' == op) && '%' == right.type) {
        right = new Unit(this.val * (right.val / 100), '%');
      } else {
        right = this.coerce(right);
      }

      switch (op) {
        case '-':
          return new Unit(this.val - right.val, type);
        case '+':
          // keyframes interpolation
          type = type || (right.type == '%' && right.type);
          return new Unit(this.val + right.val, type);
        case '/':
          return new Unit(this.val / right.val, type);
        case '*':
          return new Unit(this.val * right.val, type);
        case '%':
          return new Unit(this.val % right.val, type);
        case '**':
          return new Unit(Math.pow(this.val, right.val), type);
        case '..':
        case '...':
          var start = this.val
            , end = right.val
            , expr = new nodes.Expression
            , inclusive = '..' == op;
          if (start < end) {
            do {
              expr.push(new nodes.Unit(start));
            } while (inclusive ? ++start <= end : ++start < end);
          } else {
            do {
              expr.push(new nodes.Unit(start));
            } while (inclusive ? --start >= end : --start > end);
          }
          return expr;
      }
    }

    return super.operate(op, right);
  };

}
