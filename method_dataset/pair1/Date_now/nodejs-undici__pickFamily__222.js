class __C__ {
  pickFamily (origin, ipFamily) {
    const records = this.storage.get(origin.hostname)?.records
    if (!records) {
      return null
    }

    const family = records[ipFamily]
    if (!family) {
      return null
    }

    if (family.offset == null || family.offset === maxInt) {
      family.offset = 0
    } else {
      family.offset++
    }

    const position = family.offset % family.ips.length
    const ip = family.ips[position] ?? null
    if (ip == null) {
      return ip
    }

    if (Date.now() - ip.timestamp > ip.ttl) { // record TTL is already in ms
      // We delete expired records
      // It is possible that they have different TTL, so we manage them individually
      family.ips.splice(position, 1)
    }

    return ip
  }

}
