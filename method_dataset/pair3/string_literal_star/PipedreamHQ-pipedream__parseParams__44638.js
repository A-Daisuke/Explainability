function parseParams (str) {
  const res = []
  let state = STATE_KEY
  let charset = ''
  let inquote = false
  let escaping = false
  let p = 0
  let tmp = ''
  const len = str.length

  for (var i = 0; i < len; ++i) { // eslint-disable-line no-var
    const char = str[i]
    if (char === '\\' && inquote) {
      if (escaping) { escaping = false } else {
        escaping = true
        continue
      }
    } else if (char === '"') {
      if (!escaping) {
        if (inquote) {
          inquote = false
          state = STATE_KEY
        } else { inquote = true }
        continue
      } else { escaping = false }
    } else {
      if (escaping && inquote) { tmp += '\\' }
      escaping = false
      if ((state === STATE_CHARSET || state === STATE_LANG) && char === "'") {
        if (state === STATE_CHARSET) {
          state = STATE_LANG
          charset = tmp.substring(1)
        } else { state = STATE_VALUE }
        tmp = ''
        continue
      } else if (state === STATE_KEY &&
        (char === '*' || char === '=') &&
        res.length) {
        state = char === '*'
          ? STATE_CHARSET
          : STATE_VALUE
        res[p] = [tmp, undefined]
        tmp = ''
        continue
      } else if (!inquote && char === ';') {
        state = STATE_KEY
        if (charset) {
          if (tmp.length) {
            tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer),
              'binary',
              charset)
          }
          charset = ''
        } else if (tmp.length) {
          tmp = decodeText(tmp, 'binary', 'utf8')
        }
        if (res[p] === undefined) { res[p] = tmp } else { res[p][1] = tmp }
        tmp = ''
        ++p
        continue
      } else if (!inquote && (char === ' ' || char === '\t')) { continue }
    }
    tmp += char
  }
  if (charset && tmp.length) {
    tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer),
      'binary',
      charset)
  } else if (tmp) {
    tmp = decodeText(tmp, 'binary', 'utf8')
  }

  if (res[p] === undefined) {
    if (tmp) { res[p] = tmp }
  } else { res[p][1] = tmp }

  return res
}
