function parseVaryHeader (varyHeader, headers) {
  if (typeof varyHeader === 'string' && varyHeader.includes('*')) {
    return headers
  }

  const output = /** @type {Record<string, string | string[] | null>} */ ({})

  const varyingHeaders = typeof varyHeader === 'string'
    ? varyHeader.split(',')
    : varyHeader

  for (const header of varyingHeaders) {
    const trimmedHeader = header.trim().toLowerCase()

    output[trimmedHeader] = headers[trimmedHeader] ?? null
  }

  return output
}
