function updateLink(link) {
  var href = link.getAttribute('href');

  if (!href) {
    return;
  }
  var newLink = link.cloneNode();
  newLink.onload = function () {
    if (link.parentNode !== null) {
      // $FlowFixMe
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute(
    'href',
    // $FlowFixMe
    href.split('?')[0] + '?' + Date.now(),
  );
  // $FlowFixMe
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
