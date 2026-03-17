class __C__ {
  async getFilterData(mediaType, libraryId) {
    const cachedFilterData = Database.libraryFilterData[libraryId]
    if (cachedFilterData) {
      const cacheElapsed = Date.now() - cachedFilterData.loadedAt
      // Cache library filters for 30 mins
      // TODO: Keep cached filter data up-to-date on updates
      if (cacheElapsed < 1000 * 60 * 30) {
        return cachedFilterData
      }
    }
    const start = Date.now() // Temp for checking load times

    const data = {
      authors: [],
      genres: new Set(),
      tags: new Set(),
      series: [],
      narrators: new Set(),
      languages: new Set(),
      publishers: new Set(),
      publishedDecades: new Set(),
      bookCount: 0, // How many books returned from database query
      authorCount: 0, // How many authors returned from database query
      seriesCount: 0, // How many series returned from database query
      podcastCount: 0, // How many podcasts returned from database query
      numIssues: 0
    }

    const lastLoadedAt = cachedFilterData ? cachedFilterData.loadedAt : 0

    if (mediaType === 'podcast') {
      // Check how many podcasts are in library to determine if we need to load all of the data
      // This is done to handle the edge case of podcasts having been deleted and not having
      // an updatedAt timestamp to trigger a reload of the filter data
      const podcastModelCount = process.env.QUERY_PROFILING ? profile(Database.podcastModel.count.bind(Database.podcastModel)) : Database.podcastModel.count.bind(Database.podcastModel)
      const podcastCountFromDatabase = await podcastModelCount({
        include: {
          model: Database.libraryItemModel,
          attributes: [],
          where: {
            libraryId: libraryId
          }
        }
      })

      // To reduce the cold-start load time, first check if any podcasts
      // have an "updatedAt" timestamp since the last time the filter
      // data was loaded. If so, we can skip loading all of the data.
      // Because many items could change, just check the count of items instead
      // of actually loading the data twice
      const changedPodcasts = await podcastModelCount({
        include: {
          model: Database.libraryItemModel,
          attributes: [],
          where: {
            libraryId: libraryId,
            updatedAt: {
              [Sequelize.Op.gt]: new Date(lastLoadedAt)
            }
          }
        },
        where: {
          updatedAt: {
            [Sequelize.Op.gt]: new Date(lastLoadedAt)
          }
        },
        limit: 1
      })

      if (changedPodcasts === 0) {
        // If nothing has changed, check if the number of podcasts in
        // library is still the same as prior check before updating cache creation time

        if (podcastCountFromDatabase === Database.libraryFilterData[libraryId]?.podcastCount) {
          Logger.debug(`Filter data for ${libraryId} has not changed, returning cached data and updating cache time after ${((Date.now() - start) / 1000).toFixed(2)}s`)
          Database.libraryFilterData[libraryId].loadedAt = Date.now()
          return cachedFilterData
        }
      }

      // Something has changed in the podcasts table, so reload all of the filter data for library
      const findAll = process.env.QUERY_PROFILING ? profile(Database.podcastModel.findAll.bind(Database.podcastModel)) : Database.podcastModel.findAll.bind(Database.podcastModel)
      const podcasts = await findAll({
        include: {
          model: Database.libraryItemModel,
          attributes: [],
          where: {
            libraryId: libraryId
          }
        },
        attributes: ['tags', 'genres', 'language']
      })
      for (const podcast of podcasts) {
        if (podcast.tags?.length) {
          podcast.tags.forEach((tag) => data.tags.add(tag))
        }
        if (podcast.genres?.length) {
          podcast.genres.forEach((genre) => data.genres.add(genre))
        }
        if (podcast.language) {
          data.languages.add(podcast.language)
        }
      }

      // Set podcast count for later comparison
      data.podcastCount = podcastCountFromDatabase
    } else {
      const bookCountFromDatabase = await Database.bookModel.count({
        include: {
          model: Database.libraryItemModel,
          attributes: [],
          where: {
            libraryId: libraryId
          }
        }
      })

      const seriesCountFromDatabase = await Database.seriesModel.count({
        where: {
          libraryId: libraryId
        }
      })

      const authorCountFromDatabase = await Database.authorModel.count({
        where: {
          libraryId: libraryId
        }
      })

      // To reduce the cold-start load time, first check if any library items, series,
      // or authors have an "updatedAt" timestamp since the last time the filter
      // data was loaded. If so, we can skip loading all of the data.
      // Because many items could change, just check the count of items instead
      // of actually loading the data twice

      const changedBooks = await Database.bookModel.count({
        include: {
          model: Database.libraryItemModel,
          attributes: [],
          where: {
            libraryId: libraryId,
            updatedAt: {
              [Sequelize.Op.gt]: new Date(lastLoadedAt)
            }
          }
        },
        where: {
          updatedAt: {
            [Sequelize.Op.gt]: new Date(lastLoadedAt)
          }
        },
        limit: 1
      })

      const changedSeries = await Database.seriesModel.count({
        where: {
          libraryId: libraryId,
          updatedAt: {
            [Sequelize.Op.gt]: new Date(lastLoadedAt)
          }
        },
        limit: 1
      })

      const changedAuthors = await Database.authorModel.count({
        where: {
          libraryId: libraryId,
          updatedAt: {
            [Sequelize.Op.gt]: new Date(lastLoadedAt)
          }
        },
        limit: 1
      })

      if (changedBooks + changedSeries + changedAuthors === 0) {
        // If nothing has changed, check if the number of authors, series, and books
        // matches the prior check before updating cache creation time
        if (bookCountFromDatabase === Database.libraryFilterData[libraryId]?.bookCount && seriesCountFromDatabase === Database.libraryFilterData[libraryId]?.seriesCount && authorCountFromDatabase === Database.libraryFilterData[libraryId].authorCount) {
          Logger.debug(`Filter data for ${libraryId} has not changed, returning cached data and updating cache time after ${((Date.now() - start) / 1000).toFixed(2)}s`)
          Database.libraryFilterData[libraryId].loadedAt = Date.now()
          return cachedFilterData
        }
      }

      // Store the counts for later comparison
      data.bookCount = bookCountFromDatabase
      data.seriesCount = seriesCountFromDatabase
      data.authorCount = authorCountFromDatabase

      // Something has changed in one of the tables, so reload all of the filter data for library
      const books = await Database.bookModel.findAll({
        include: {
          model: Database.libraryItemModel,
          attributes: ['isMissing', 'isInvalid'],
          where: {
            libraryId: libraryId
          }
        },
        attributes: ['tags', 'genres', 'publisher', 'publishedYear', 'narrators', 'language']
      })
      for (const book of books) {
        if (book.libraryItem.isMissing || book.libraryItem.isInvalid) data.numIssues++
        if (book.tags?.length) {
          book.tags.forEach((tag) => data.tags.add(tag))
        }
        if (book.genres?.length) {
          book.genres.forEach((genre) => data.genres.add(genre))
        }
        if (book.narrators?.length) {
          book.narrators.forEach((narrator) => data.narrators.add(narrator))
        }
        if (book.publisher) data.publishers.add(book.publisher)
        // Check if published year exists and is valid
        if (book.publishedYear && !isNaN(book.publishedYear) && book.publishedYear > 0 && book.publishedYear < 3000) {
          const decade = (Math.floor(book.publishedYear / 10) * 10).toString()
          data.publishedDecades.add(decade)
        }
        if (book.language) data.languages.add(book.language)
      }

      const series = await Database.seriesModel.findAll({
        where: {
          libraryId: libraryId
        },
        attributes: ['id', 'name']
      })
      series.forEach((s) => data.series.push({ id: s.id, name: s.name || 'No Title' }))

      const authors = await Database.authorModel.findAll({
        where: {
          libraryId: libraryId
        },
        attributes: ['id', 'name']
      })
      authors.forEach((a) => data.authors.push({ id: a.id, name: a.name }))
    }

    data.authors = naturalSort(data.authors).asc((au) => au.name)
    data.genres = naturalSort([...data.genres]).asc()
    data.tags = naturalSort([...data.tags]).asc()
    data.series = naturalSort(data.series).asc((se) => se.name)
    data.narrators = naturalSort([...data.narrators]).asc()
    data.publishers = naturalSort([...data.publishers]).asc()
    data.publishedDecades = naturalSort([...data.publishedDecades]).asc()
    data.languages = naturalSort([...data.languages]).asc()
    data.loadedAt = Date.now()
    Database.libraryFilterData[libraryId] = data

    Logger.debug(`Loaded filterdata in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    return data
  }

}
