function findDocumentHostElement(_window) {
  if (!selector) {
    selector = selectInShadows('object, iframe')
  }

  if (_window._frameElement !== undefined) {
    return _window._frameElement
  }

  _window._frameElement = null

  var potentialHosts = _window.parent.document.querySelectorAll(selector)
  ;[].some.call(potentialHosts, function (element) {
    var _document = getContentDocument(element)
    if (_document !== _window.document) {
      return false
    }

    _window._frameElement = element
    return true
  })

  return _window._frameElement
}
