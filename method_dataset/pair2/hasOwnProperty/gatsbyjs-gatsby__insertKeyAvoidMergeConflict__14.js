function insertKeyAvoidMergeConflict(pkgJson, key, value) {
  if (pkgJson[key]) {
    pkgJson[key] = value
    return pkgJson
  } else {
    const newPkgJson = {}
    let inserted = false
    for (const pkgKey in pkgJson) {
      if (pkgJson.hasOwnProperty(pkgKey)) {
        if (!inserted && /depend/i.test(pkgKey)) {
          inserted = true
          newPkgJson[key] = value
        }
        newPkgJson[pkgKey] = pkgJson[pkgKey]
      }
    }
    return newPkgJson
  }
}
