function queryFocusableQuick() {
  var _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    context = _ref.context,
    includeContext = _ref.includeContext,
    includeOnlyTabbable = _ref.includeOnlyTabbable

  var _selector = selector$2()
  var elements = context.querySelectorAll(_selector)
  // the selector potentially matches more than really is focusable

  var _isFocusable = isFocusable.rules.except({
    onlyTabbable: includeOnlyTabbable,
  })

  var result = [].filter.call(elements, _isFocusable)

  // add context if requested and focusable
  if (includeContext && _isFocusable(context)) {
    result.unshift(context)
  }

  return result
}
