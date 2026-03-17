class __C__ {
  async scanNewBookLibraryItem(libraryItemData, librarySettings, libraryScan) {
    // Scan audio files found
    let scannedAudioFiles = await AudioFileScanner.executeMediaFileScans(libraryItemData.mediaType, libraryItemData, libraryItemData.audioLibraryFiles)
    scannedAudioFiles = AudioFileScanner.runSmartTrackOrder(libraryItemData.relPath, scannedAudioFiles)

    // Find ebook file (prefer epub)
    let ebookLibraryFile = librarySettings.audiobooksOnly ? null : libraryItemData.ebookLibraryFiles.find((lf) => lf.metadata.ext.slice(1).toLowerCase() === 'epub') || libraryItemData.ebookLibraryFiles[0]

    // Do not add library items that have no valid audio files and no ebook file
    if (!ebookLibraryFile && !scannedAudioFiles.length) {
      libraryScan.addLog(LogLevel.WARN, `Library item at path "${libraryItemData.relPath}" has no audio files and no ebook file - ignoring`)
      return null
    }

    let ebookFileScanData = null
    if (ebookLibraryFile) {
      ebookLibraryFile = ebookLibraryFile.toJSON()
      ebookLibraryFile.ebookFormat = ebookLibraryFile.metadata.ext.slice(1).toLowerCase()
      ebookFileScanData = await parseEbookMetadata.parse(ebookLibraryFile)
    }

    const bookMetadata = await this.getBookMetadataFromScanData(scannedAudioFiles, ebookFileScanData, libraryItemData, libraryScan, librarySettings)
    bookMetadata.explicit = !!bookMetadata.explicit // Ensure boolean
    bookMetadata.abridged = !!bookMetadata.abridged // Ensure boolean

    let duration = 0
    scannedAudioFiles.forEach((af) => (duration += !isNaN(af.duration) ? Number(af.duration) : 0))
    const bookObject = {
      ...bookMetadata,
      audioFiles: scannedAudioFiles,
      ebookFile: ebookLibraryFile || null,
      duration,
      bookAuthors: [],
      bookSeries: []
    }

    const createdAtTimestamp = new Date().getTime()
    if (bookMetadata.authors.length) {
      for (const authorName of bookMetadata.authors) {
        const matchingAuthorId = await Database.getAuthorIdByName(libraryItemData.libraryId, authorName)
        if (matchingAuthorId) {
          bookObject.bookAuthors.push({
            authorId: matchingAuthorId
          })
        } else {
          // New author
          bookObject.bookAuthors.push({
            // Ensures authors are in a set order
            createdAt: createdAtTimestamp + bookObject.bookAuthors.length,
            author: {
              libraryId: libraryItemData.libraryId,
              name: authorName,
              lastFirst: Database.authorModel.getLastFirst(authorName)
            }
          })
        }
      }
    }
    if (bookMetadata.series.length) {
      for (const seriesObj of bookMetadata.series) {
        if (!seriesObj.name) continue
        const matchingSeriesId = await Database.getSeriesIdByName(libraryItemData.libraryId, seriesObj.name)
        if (matchingSeriesId) {
          bookObject.bookSeries.push({
            seriesId: matchingSeriesId,
            sequence: seriesObj.sequence
          })
        } else {
          bookObject.bookSeries.push({
            sequence: seriesObj.sequence,
            series: {
              name: seriesObj.name,
              nameIgnorePrefix: getTitleIgnorePrefix(seriesObj.name),
              libraryId: libraryItemData.libraryId
            }
          })
        }
      }
    }

    const libraryItemObj = libraryItemData.libraryItemObject
    libraryItemObj.id = uuidv4() // Generate library item id ahead of time to use for saving extracted cover image
    libraryItemObj.isMissing = false
    libraryItemObj.isInvalid = false
    libraryItemObj.extraData = {}
    libraryItemObj.title = bookMetadata.title
    libraryItemObj.titleIgnorePrefix = getTitleIgnorePrefix(bookMetadata.title)
    libraryItemObj.authorNamesFirstLast = bookMetadata.authors.join(', ')
    libraryItemObj.authorNamesLastFirst = bookMetadata.authors.map((author) => Database.authorModel.getLastFirst(author)).join(', ')

    // Set isSupplementary flag on ebook library files
    for (const libraryFile of libraryItemObj.libraryFiles) {
      if (globals.SupportedEbookTypes.includes(libraryFile.metadata.ext.slice(1).toLowerCase())) {
        libraryFile.isSupplementary = libraryFile.ino !== ebookLibraryFile?.ino
      }
    }

    // If cover was not found in folder then check embedded covers in audio files OR ebook file
    const libraryItemDir = libraryItemObj.isFile ? null : libraryItemObj.path
    if (!bookObject.coverPath) {
      let extractedCoverPath = await CoverManager.saveEmbeddedCoverArt(scannedAudioFiles, libraryItemObj.id, libraryItemDir)
      if (extractedCoverPath) {
        libraryScan.addLog(LogLevel.DEBUG, `Extracted embedded cover from audio file at "${extractedCoverPath}" for book "${bookObject.title}"`)
        bookObject.coverPath = extractedCoverPath
      } else if (ebookFileScanData?.ebookCoverPath) {
        extractedCoverPath = await CoverManager.saveEbookCoverArt(ebookFileScanData, libraryItemObj.id, libraryItemDir)
        if (extractedCoverPath) {
          libraryScan.addLog(LogLevel.DEBUG, `Extracted embedded cover from ebook file at "${extractedCoverPath}" for book "${bookObject.title}"`)
          bookObject.coverPath = extractedCoverPath
        }
      }
    }

    // If cover not found then search for cover if enabled in settings
    if (!bookObject.coverPath && Database.serverSettings.scannerFindCovers) {
      const authorName = bookMetadata.authors.join(', ')
      bookObject.coverPath = await this.searchForCover(libraryItemObj.id, libraryItemDir, bookObject.title, authorName, libraryScan)
    }

    libraryItemObj.book = bookObject
    const libraryItem = await Database.libraryItemModel.create(libraryItemObj, {
      include: {
        model: Database.bookModel,
        include: [
          {
            model: Database.bookSeriesModel,
            include: {
              model: Database.seriesModel
            }
          },
          {
            model: Database.bookAuthorModel,
            include: {
              model: Database.authorModel
            }
          }
        ]
      }
    })

    // Update library filter data
    if (libraryItem.book.bookSeries?.length) {
      for (const bs of libraryItem.book.bookSeries) {
        if (bs.series) {
          Database.addSeriesToFilterData(libraryItemData.libraryId, bs.series.name, bs.series.id)
        }
      }
    }
    if (libraryItem.book.bookAuthors?.length) {
      for (const ba of libraryItem.book.bookAuthors) {
        if (ba.author) {
          Database.addAuthorToFilterData(libraryItemData.libraryId, ba.author.name, ba.author.id)
        }
      }
    }
    Database.addNarratorsToFilterData(libraryItemData.libraryId, libraryItem.book.narrators)
    Database.addGenresToFilterData(libraryItemData.libraryId, libraryItem.book.genres)
    Database.addTagsToFilterData(libraryItemData.libraryId, libraryItem.book.tags)
    Database.addPublisherToFilterData(libraryItemData.libraryId, libraryItem.book.publisher)
    Database.addLanguageToFilterData(libraryItemData.libraryId, libraryItem.book.language)

    const publishedYear = libraryItem.book.publishedYear
    const decade = publishedYear ? `${Math.floor(publishedYear / 10) * 10}` : null
    Database.addPublishedDecadeToFilterData(libraryItemData.libraryId, decade)

    // Load for emitting to client
    libraryItem.media = await libraryItem.getMedia({
      include: [
        {
          model: Database.authorModel,
          through: {
            attributes: ['id', 'createdAt']
          }
        },
        {
          model: Database.seriesModel,
          through: {
            attributes: ['id', 'sequence', 'createdAt']
          }
        }
      ],
      order: [
        [Database.authorModel, Database.bookAuthorModel, 'createdAt', 'ASC'],
        [Database.seriesModel, 'bookSeries', 'createdAt', 'ASC']
      ]
    })

    await this.saveMetadataFile(libraryItem, libraryScan)
    if (global.ServerSettings.storeMetadataWithItem && !libraryItem.isFile) {
      libraryItem.changed('libraryFiles', true)
      await libraryItem.save()
    }

    return libraryItem
  }

}
