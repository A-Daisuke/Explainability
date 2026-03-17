function migrateSeries(oldSerieses, oldLibraryItems) {
  const _newRecords = []
  // Originaly series were shared between libraries if they had the same name
  // Series will be separate between libraries
  for (const oldSeries of oldSerieses) {
    // Get an array of NEW library ids that have this series
    const librariesWithThisSeries = [
      ...new Set(
        oldLibraryItems
          .map((li) => {
            if (!li.media.metadata.series?.some((se) => se.id === oldSeries.id)) return null
            return oldDbIdMap.libraries[li.libraryId]
          })
          .filter((lid) => lid)
      )
    ]

    if (!librariesWithThisSeries.length) {
      Logger.error(`[dbMigration] Series ${oldSeries.name} was not found in any libraries`)
    }

    for (const libraryId of librariesWithThisSeries) {
      const Series = {
        id: uuidv4(),
        name: oldSeries.name,
        nameIgnorePrefix: getTitleIgnorePrefix(oldSeries.name),
        description: oldSeries.description || null,
        createdAt: oldSeries.addedAt || Date.now(),
        updatedAt: oldSeries.updatedAt || Date.now(),
        libraryId
      }
      if (!oldDbIdMap.series[libraryId]) oldDbIdMap.series[libraryId] = {}
      oldDbIdMap.series[libraryId][oldSeries.id] = Series.id
      _newRecords.push(Series)
    }
  }
  return _newRecords
}
