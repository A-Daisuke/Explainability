function __method_wrapper__() {
  #defaultPick (origin, hostnameRecords, affinity) {
    let ip = null
    const { records, offset } = hostnameRecords

    let family
    if (this.dualStack) {
      if (affinity == null) {
        // Balance between ip families
        if (offset == null || offset === maxInt) {
          hostnameRecords.offset = 0
          affinity = 4
        } else {
          hostnameRecords.offset++
          affinity = (hostnameRecords.offset & 1) === 1 ? 6 : 4
        }
      }

      if (records[affinity] != null && records[affinity].ips.length > 0) {
        family = records[affinity]
      } else {
        family = records[affinity === 4 ? 6 : 4]
      }
    } else {
      family = records[affinity]
    }

    // If no IPs we return null
    if (family == null || family.ips.length === 0) {
      return ip
    }

    if (family.offset == null || family.offset === maxInt) {
      family.offset = 0
    } else {
      family.offset++
    }

    const position = family.offset % family.ips.length
    ip = family.ips[position] ?? null

    if (ip == null) {
      return ip
    }

    if (Date.now() - ip.timestamp > ip.ttl) { // record TTL is already in ms
      // We delete expired records
      // It is possible that they have different TTL, so we manage them individually
      family.ips.splice(position, 1)
      return this.pick(origin, hostnameRecords, affinity)
    }

    return ip
  }

}
