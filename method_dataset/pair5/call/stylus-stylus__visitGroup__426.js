function __method_wrapper__() {
  visitGroup(group) {
    var stack = this.keyframe ? [] : this.stack
      , comma = this.compress ? ',' : ',\n';

    stack.push(group.nodes);

    // selectors
    if (group.block.hasProperties) {
      var selectors = utils.compileSelectors.call(this, stack)
        , len = selectors.length;

      if (len) {
        if (this.keyframe) comma = this.compress ? ',' : ', ';

        for (var i = 0; i < len; ++i) {
          var selector = selectors[i]
            , last = (i == len - 1);

          // keyframe blocks (10%, 20% { ... })
          if (this.keyframe) selector = i ? selector.trim() : selector;

          this.buf += this.out(selector + (last ? '' : comma), group.nodes[i]);
        }
      } else {
        group.block.lacksRenderedSelectors = true;
      }
    }

    // output block
    this.visit(group.block);
    stack.pop();
  };

}
