class __C__ {
  looksLikeSelector(fromProperty) {
    var i = 1
      , node
      , brace;

    // Real property
    if (fromProperty && ':' == this.lookahead(i + 1).type
      && (this.lookahead(i + 1).space || 'indent' == this.lookahead(i + 2).type))
      return false;

    // Assume selector when an ident is
    // followed by a selector
    while ('ident' == this.lookahead(i).type
      && ('newline' == this.lookahead(i + 1).type
        || ',' == this.lookahead(i + 1).type)) i += 2;

    while (this.isSelectorToken(i)
      || ',' == this.lookahead(i).type) {

      if ('selector' == this.lookahead(i).type)
        return true;

      if ('&' == this.lookahead(i + 1).type)
        return true;

      // Hash values inside properties
      if (
        i > 1 &&
        'ident' === this.lookahead(i - 1).type &&
        '.' === this.lookahead(i).type &&
        'ident' === this.lookahead(i + 1).type
      ) {
        while ((node = this.lookahead(i + 2))) {
          if ([
            'indent',
            'outdent',
            '{',
            ';',
            'eos',
            'selector',
            'media',
            'if',
            'atrule',
            ')',
            '}',
            'unit',
            '[',
            'for',
            'function'
          ].indexOf(node.type) !== -1) {
            if (node.type === '[') {
              while ((node = this.lookahead(i + 3)) && node.type !== ']') {
                if (~['.', 'unit'].indexOf(node.type)) {
                  return false;
                }
                i += 1
              }
            } else {
              if (this.isPseudoSelector(i + 2)) {
                return true;
              }

              if (node.type === ')' && this.lookahead(i + 3) && this.lookahead(i + 3).type === '}') {
                break;
              }

              return [
                'outdent',
                ';',
                'eos',
                'media',
                'if',
                'atrule',
                ')',
                '}',
                'unit',
                'for',
                'function'
              ].indexOf(node.type) === -1;
            }
          }

          i += 1
        }

        return true;
      }

      if ('.' == this.lookahead(i).type && 'ident' == this.lookahead(i + 1).type) {
        return true;
      }

      if ('*' == this.lookahead(i).type && 'newline' == this.lookahead(i + 1).type)
        return true;

      // Pseudo-elements
      if (':' == this.lookahead(i).type
        && ':' == this.lookahead(i + 1).type)
        return true;

      // #a after an ident and newline
      if ('color' == this.lookahead(i).type
        && 'newline' == this.lookahead(i - 1).type)
        return true;

      if (this.looksLikeAttributeSelector(i))
        return true;

      if (('=' == this.lookahead(i).type || 'function' == this.lookahead(i).type)
        && '{' == this.lookahead(i + 1).type)
        return false;

      // Hash values inside properties
      if (':' == this.lookahead(i).type
        && !this.isPseudoSelector(i + 1)
        && this.lineContains('.'))
        return false;

      // the ':' token within braces signifies
      // a selector. ex: "foo{bar:'baz'}"
      if ('{' == this.lookahead(i).type) brace = true;
      else if ('}' == this.lookahead(i).type) brace = false;
      if (brace && ':' == this.lookahead(i).type) return true;

      // '{' preceded by a space is considered a selector.
      // for example "foo{bar}{baz}" may be a property,
      // however "foo{bar} {baz}" is a selector
      if ('space' == this.lookahead(i).type
        && '{' == this.lookahead(i + 1).type)
        return true;

      // Assume pseudo selectors are NOT properties
      // as 'td:th-child(1)' may look like a property
      // and function call to the parser otherwise
      if (':' == this.lookahead(i++).type
        && !this.lookahead(i - 1).space
        && this.isPseudoSelector(i))
        return true;

      // Trailing space
      if ('space' == this.lookahead(i).type
        && 'newline' == this.lookahead(i + 1).type
        && '{' == this.lookahead(i + 2).type)
        return true;

      if (',' == this.lookahead(i).type
        && 'newline' == this.lookahead(i + 1).type)
        return true;
    }

    // Trailing comma
    if (',' == this.lookahead(i).type
      && 'newline' == this.lookahead(i + 1).type)
      return true;

    // Trailing brace
    if ('{' == this.lookahead(i).type
      && 'newline' == this.lookahead(i + 1).type)
      return true;

    // css-style mode, false on ; }
    if (this.css) {
      if (';' == this.lookahead(i).type ||
        '}' == this.lookahead(i - 1).type)
        return false;
    }

    // Trailing separators
    while (!~[
      'indent'
      , 'outdent'
      , 'newline'
      , 'for'
      , 'if'
      , ';'
      , '}'
      , 'eos'].indexOf(this.lookahead(i).type))
      ++i;

    if ('indent' == this.lookahead(i).type)
      return true;
  }

}
