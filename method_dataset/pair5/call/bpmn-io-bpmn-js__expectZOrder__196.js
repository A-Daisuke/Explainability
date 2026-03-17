export function expectZOrder() {

  var elements = Array.prototype.slice.call(arguments);

  var next;

  forEach(elements, function(e, idx) {

    next = elements[idx + 1];

    if (next && compareZOrder(e, next) !== -1) {
      throw new Error(
        `expected <element#${ next.id || next }> to be in front of <element#${ e.id || e }>`
      );
    }
  });

  return true;
}