  function feed(chunk) {
    bytes = bytes.concat(Array.from(chunk))
    buffer = new TextDecoder().decode(new Uint8Array(bytes))
    if (isFirstChunk && hasBom(buffer)) {
      buffer = buffer.slice(BOM.length)
    }
    isFirstChunk = false
    const length = buffer.length
    let position = 0
    let discardTrailingNewline = false
    while (position < length) {
      if (discardTrailingNewline) {
        if (buffer[position] === '\n') {
          ++position
        }
        discardTrailingNewline = false
      }
      let lineLength = -1
      let fieldLength = startingFieldLength
      let character
      for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
        character = buffer[index]
        if (character === ':' && fieldLength < 0) {
          fieldLength = index - position
        } else if (character === '\r') {
          discardTrailingNewline = true
          lineLength = index - position
        } else if (character === '\n') {
          lineLength = index - position
        }
      }
      if (lineLength < 0) {
        startingPosition = length - position
        startingFieldLength = fieldLength
        break
      } else {
        startingPosition = 0
        startingFieldLength = -1
      }
      parseEventStreamLine(buffer, position, fieldLength, lineLength)
      position += lineLength + 1
    }
    if (position === length) {
      bytes = []
      buffer = ''
    } else if (position > 0) {
      bytes = bytes.slice(new TextEncoder().encode(buffer.slice(0, position)).length)
      buffer = buffer.slice(position)
    }
  }
