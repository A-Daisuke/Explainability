class __C__ {
  setRecords (origin, addresses) {
    const timestamp = Date.now()
    const records = { records: { 4: null, 6: null } }
    let minTTL = this.#maxTTL
    for (const record of addresses) {
      record.timestamp = timestamp
      if (typeof record.ttl === 'number') {
        // The record TTL is expected to be in ms
        record.ttl = Math.min(record.ttl, this.#maxTTL)
        minTTL = Math.min(minTTL, record.ttl)
      } else {
        record.ttl = this.#maxTTL
      }

      const familyRecords = records.records[record.family] ?? { ips: [] }

      familyRecords.ips.push(record)
      records.records[record.family] = familyRecords
    }

    // We provide a default TTL if external storage will be used without TTL per record-level support
    this.storage.set(origin.hostname, records, { ttl: minTTL })
  }

}
