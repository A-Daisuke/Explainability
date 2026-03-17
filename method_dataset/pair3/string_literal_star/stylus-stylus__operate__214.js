function __method_wrapper__() {
  operate(op, right) {
    if ('in' != op) right = right.first

    switch (op) {
      case 'is a':
        if ('string' == right.nodeName && 'color' == right.string) {
          return nodes.true;
        }
        break;
      case '+':
        switch (right.nodeName) {
          case 'unit':
            var n = right.val;
            switch (right.type) {
              case '%': return adjust(this, new nodes.String('lightness'), right);
              case 'deg': return this.hsla.adjustHue(n).rgba;
              default: return this.add(n, n, n, 0);
            }
          case 'rgba':
            return this.add(right.r, right.g, right.b, right.a);
          case 'hsla':
            return this.hsla.add(right.h, right.s, right.l);
        }
        break;
      case '-':
        switch (right.nodeName) {
          case 'unit':
            var n = right.val;
            switch (right.type) {
              case '%': return adjust(this, new nodes.String('lightness'), new nodes.Unit(-n, '%'));
              case 'deg': return this.hsla.adjustHue(-n).rgba;
              default: return this.sub(n, n, n, 0);
            }
          case 'rgba':
            return this.sub(right.r, right.g, right.b, right.a);
          case 'hsla':
            return this.hsla.sub(right.h, right.s, right.l);
        }
        break;
      case '*':
        switch (right.nodeName) {
          case 'unit':
            return this.multiply(right.val);
        }
        break;
      case '/':
        switch (right.nodeName) {
          case 'unit':
            return this.divide(right.val);
        }
        break;
    }
    return super.operate(op, right);
  };

}
