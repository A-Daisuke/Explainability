function __method_wrapper__() {
  editormd.filterHTMLTags = function(html, filters) {
    if (typeof html !== 'string') {
      html = new String(html)
    }

    if (typeof filters !== 'string') {
      return html
    }

    var expression = filters.split('|')
    var filterTags = expression[0].split(',')
    var attrs = expression[1]

    for (var i = 0, len = filterTags.length; i < len; i++) {
      var tag = filterTags[i]

      html = html.replace(
        new RegExp('<s*' + tag + 's*([^>]*)>([^>]*)<s*/' + tag + 's*>', 'igm'),
        ''
      )
    }

    // return html;

    if (typeof attrs !== 'undefined') {
      var htmlTagRegex = /\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/gi

      if (attrs === '*') {
        html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
          return '<' + $2 + '>' + $4 + '</' + $5 + '>'
        })
      } else if (attrs === 'on*') {
        html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
          var el = $('<' + $2 + '>' + $4 + '</' + $5 + '>')
          var _attrs = $($1)[0].attributes
          var $attrs = {}

          $.each(_attrs, function(i, e) {
            if (e.nodeName !== '"') $attrs[e.nodeName] = e.nodeValue
          })

          $.each($attrs, function(i) {
            if (i.indexOf('on') === 0) {
              delete $attrs[i]
            }
          })

          el.attr($attrs)

          var text = typeof el[1] !== 'undefined' ? $(el[1]).text() : ''

          return el[0].outerHTML + text
        })
      } else if (attrs === 'filterXSS') {
        var tags = [
            'a',
            'abbr',
            'address',
            'area',
            'article',
            'aside',
            'audio',
            'b',
            'bdi',
            'bdo',
            'big',
            'blockquote',
            'br',
            'caption',
            'center',
            'cite',
            'code',
            'col',
            'colgroup',
            'dd',
            'del',
            'details',
            'div',
            'dl',
            'dt',
            'em',
            'font',
            'footer',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'header',
            'hr',
            'i',
            'img',
            'ins',
            'li',
            'mark',
            'nav',
            'ol',
            'p',
            'pre',
            's',
            'section',
            'small',
            'span',
            'sub',
            'sup',
            'strong',
            'table',
            'tbody',
            'td',
            'tfoot',
            'th',
            'thead',
            'tr',
            'tt',
            'u',
            'ul',
            'video',
            'input'
          ],
          tagAttrs = [
            'target',
            'title',
            'shape',
            'coords',
            'href',
            'alt',
            'autoplay',
            'controls',
            'loop',
            'preload',
            'src',
            'dir',
            'cite',
            'align',
            'valign',
            'span',
            'width',
            'height',
            'datetime',
            'open',
            'color',
            'size',
            'face',
            'border',
            'rowspan',
            'colspan',
            'style',
            'class',
            'id',
            'name',
            'type',
            'checked',
            'disabled'
          ],
          whiteList = (function() {
            var result = {}
            for (var i = 0, len = tags.length; i < len; i++) {
              result[tags[i]] = tagAttrs
            }
            return result
          })()
        html = filterXSS(html, {
          whiteList: whiteList
        })
      } else {
        html = html.replace(htmlTagRegex, function($1, $2, $3, $4) {
          var filterAttrs = attrs.split(',')
          var el = $($1)
          el.html($4)

          $.each(filterAttrs, function(i) {
            el.attr(filterAttrs[i], null)
          })

          return el[0].outerHTML
        })
      }
    }

    return html
  }

}
