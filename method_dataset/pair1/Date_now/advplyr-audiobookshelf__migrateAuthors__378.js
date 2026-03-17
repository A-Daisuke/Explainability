function migrateAuthors(oldAuthors, oldLibraryItems) {
  const _newRecords = []
  for (const oldAuthor of oldAuthors) {
    // Get an array of NEW library ids that have this author
    const librariesWithThisAuthor = [
      ...new Set(
        oldLibraryItems
          .map((li) => {
            if (!li.media.metadata.authors?.some((au) => au.id === oldAuthor.id)) return null
            if (!oldDbIdMap.libraries[li.libraryId]) {
              Logger.warn(`[dbMigration] Authors library id ${li.libraryId} was not migrated`)
            }
            return oldDbIdMap.libraries[li.libraryId]
          })
          .filter((lid) => lid)
      )
    ]

    if (!librariesWithThisAuthor.length) {
      Logger.error(`[dbMigration] Author ${oldAuthor.name} was not found in any libraries`)
    }

    for (const libraryId of librariesWithThisAuthor) {
      const lastFirst = oldAuthor.name ? parseNameString.nameToLastFirst(oldAuthor.name) : ''
      const Author = {
        id: uuidv4(),
        name: oldAuthor.name,
        lastFirst,
        asin: oldAuthor.asin || null,
        description: oldAuthor.description,
        imagePath: oldAuthor.imagePath,
        createdAt: oldAuthor.addedAt || Date.now(),
        updatedAt: oldAuthor.updatedAt || Date.now(),
        libraryId
      }
      if (!oldDbIdMap.authors[libraryId]) oldDbIdMap.authors[libraryId] = {}
      oldDbIdMap.authors[libraryId][oldAuthor.id] = Author.id
      _newRecords.push(Author)
    }
  }
  return _newRecords
}
