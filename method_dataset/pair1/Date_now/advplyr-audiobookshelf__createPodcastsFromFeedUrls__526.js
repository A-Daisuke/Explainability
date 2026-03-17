function __method_wrapper__() {
  async createPodcastsFromFeedUrls(rssFeedUrls, folder, autoDownloadEpisodes, cronManager) {
    const taskTitleString = {
      text: 'OPML import',
      key: 'MessageTaskOpmlImport'
    }
    const taskDescriptionString = {
      text: `Creating podcasts from ${rssFeedUrls.length} RSS feeds`,
      key: 'MessageTaskOpmlImportDescription',
      subs: [rssFeedUrls.length]
    }
    const task = TaskManager.createAndAddTask('opml-import', taskTitleString, taskDescriptionString, true, null)
    let numPodcastsAdded = 0
    Logger.info(`[PodcastManager] createPodcastsFromFeedUrls: Importing ${rssFeedUrls.length} RSS feeds to folder "${folder.path}"`)
    for (const feedUrl of rssFeedUrls) {
      const feed = await getPodcastFeed(feedUrl).catch(() => null)
      if (!feed?.episodes) {
        const taskTitleStringFeed = {
          text: 'OPML import feed',
          key: 'MessageTaskOpmlImportFeed'
        }
        const taskDescriptionStringFeed = {
          text: `Importing RSS feed "${feedUrl}"`,
          key: 'MessageTaskOpmlImportFeedDescription',
          subs: [feedUrl]
        }
        const taskErrorString = {
          text: 'Failed to get podcast feed',
          key: 'MessageTaskOpmlImportFeedFailed'
        }
        TaskManager.createAndEmitFailedTask('opml-import-feed', taskTitleStringFeed, taskDescriptionStringFeed, taskErrorString)
        Logger.error(`[PodcastManager] createPodcastsFromFeedUrls: Failed to get podcast feed for "${feedUrl}"`)
        continue
      }

      const podcastFilename = sanitizeFilename(feed.metadata.title)
      const podcastPath = filePathToPOSIX(`${folder.path}/${podcastFilename}`)
      // Check if a library item with this podcast folder exists already
      const existingLibraryItem =
        (await Database.libraryItemModel.count({
          where: {
            path: podcastPath
          }
        })) > 0
      if (existingLibraryItem) {
        Logger.error(`[PodcastManager] createPodcastsFromFeedUrls: Podcast already exists at path "${podcastPath}"`)
        const taskTitleStringFeed = {
          text: 'OPML import feed',
          key: 'MessageTaskOpmlImportFeed'
        }
        const taskDescriptionStringPodcast = {
          text: `Creating podcast "${feed.metadata.title}"`,
          key: 'MessageTaskOpmlImportFeedPodcastDescription',
          subs: [feed.metadata.title]
        }
        const taskErrorString = {
          text: 'Podcast already exists at path',
          key: 'MessageTaskOpmlImportFeedPodcastExists'
        }
        TaskManager.createAndEmitFailedTask('opml-import-feed', taskTitleStringFeed, taskDescriptionStringPodcast, taskErrorString)
        continue
      }

      const successCreatingPath = await fs
        .ensureDir(podcastPath)
        .then(() => true)
        .catch((error) => {
          Logger.error(`[PodcastManager] Failed to ensure podcast dir "${podcastPath}"`, error)
          return false
        })
      if (!successCreatingPath) {
        Logger.error(`[PodcastManager] createPodcastsFromFeedUrls: Failed to create podcast folder at "${podcastPath}"`)
        const taskTitleStringFeed = {
          text: 'OPML import feed',
          key: 'MessageTaskOpmlImportFeed'
        }
        const taskDescriptionStringPodcast = {
          text: `Creating podcast "${feed.metadata.title}"`,
          key: 'MessageTaskOpmlImportFeedPodcastDescription',
          subs: [feed.metadata.title]
        }
        const taskErrorString = {
          text: 'Failed to create podcast folder',
          key: 'MessageTaskOpmlImportFeedPodcastFailed'
        }
        TaskManager.createAndEmitFailedTask('opml-import-feed', taskTitleStringFeed, taskDescriptionStringPodcast, taskErrorString)
        continue
      }

      let newLibraryItem = null
      const transaction = await Database.sequelize.transaction()
      try {
        const libraryItemFolderStats = await getFileTimestampsWithIno(podcastPath)

        const podcastPayload = {
          autoDownloadEpisodes,
          metadata: {
            title: feed.metadata.title,
            author: feed.metadata.author,
            description: feed.metadata.description,
            releaseDate: '',
            genres: [...feed.metadata.categories],
            feedUrl: feed.metadata.feedUrl,
            imageUrl: feed.metadata.image,
            itunesPageUrl: '',
            itunesId: '',
            itunesArtistId: '',
            language: '',
            numEpisodes: feed.numEpisodes
          }
        }
        const podcast = await Database.podcastModel.createFromRequest(podcastPayload, transaction)

        newLibraryItem = await Database.libraryItemModel.create(
          {
            ino: libraryItemFolderStats.ino,
            path: podcastPath,
            relPath: podcastFilename,
            mediaId: podcast.id,
            mediaType: 'podcast',
            isFile: false,
            isMissing: false,
            isInvalid: false,
            mtime: libraryItemFolderStats.mtimeMs || 0,
            ctime: libraryItemFolderStats.ctimeMs || 0,
            birthtime: libraryItemFolderStats.birthtimeMs || 0,
            size: 0,
            libraryFiles: [],
            extraData: {},
            libraryId: folder.libraryId,
            libraryFolderId: folder.id,
            title: podcast.title,
            titleIgnorePrefix: podcast.titleIgnorePrefix
          },
          { transaction }
        )

        await transaction.commit()
      } catch (error) {
        await transaction.rollback()
        Logger.error(`[PodcastManager] createPodcastsFromFeedUrls: Failed to create podcast library item for "${feed.metadata.title}"`, error)
        const taskTitleStringFeed = {
          text: 'OPML import feed',
          key: 'MessageTaskOpmlImportFeed'
        }
        const taskDescriptionStringPodcast = {
          text: `Creating podcast "${feed.metadata.title}"`,
          key: 'MessageTaskOpmlImportFeedPodcastDescription',
          subs: [feed.metadata.title]
        }
        const taskErrorString = {
          text: 'Failed to create podcast library item',
          key: 'MessageTaskOpmlImportFeedPodcastFailed'
        }
        TaskManager.createAndEmitFailedTask('opml-import-feed', taskTitleStringFeed, taskDescriptionStringPodcast, taskErrorString)
        continue
      }

      newLibraryItem.media = await newLibraryItem.getMediaExpanded()

      // Download and save cover image
      if (typeof feed.metadata.image === 'string' && feed.metadata.image.startsWith('http')) {
        // Podcast cover will always go into library item folder
        const coverResponse = await CoverManager.downloadCoverFromUrlNew(feed.metadata.image, newLibraryItem.id, newLibraryItem.path, true)
        if (coverResponse.error) {
          Logger.error(`[PodcastManager] Download cover error from "${feed.metadata.image}": ${coverResponse.error}`)
        } else if (coverResponse.cover) {
          const coverImageFileStats = await getFileTimestampsWithIno(coverResponse.cover)
          if (!coverImageFileStats) {
            Logger.error(`[PodcastManager] Failed to get cover image stats for "${coverResponse.cover}"`)
          } else {
            // Add libraryFile to libraryItem and coverPath to podcast
            const newLibraryFile = {
              ino: coverImageFileStats.ino,
              fileType: 'image',
              addedAt: Date.now(),
              updatedAt: Date.now(),
              metadata: {
                filename: Path.basename(coverResponse.cover),
                ext: Path.extname(coverResponse.cover).slice(1),
                path: coverResponse.cover,
                relPath: Path.basename(coverResponse.cover),
                size: coverImageFileStats.size,
                mtimeMs: coverImageFileStats.mtimeMs || 0,
                ctimeMs: coverImageFileStats.ctimeMs || 0,
                birthtimeMs: coverImageFileStats.birthtimeMs || 0
              }
            }
            newLibraryItem.libraryFiles.push(newLibraryFile)
            newLibraryItem.changed('libraryFiles', true)
            await newLibraryItem.save()

            newLibraryItem.media.coverPath = coverResponse.cover
            await newLibraryItem.media.save()
          }
        }
      }

      SocketAuthority.libraryItemEmitter('item_added', newLibraryItem)

      // Turn on podcast auto download cron if not already on
      if (newLibraryItem.media.autoDownloadEpisodes) {
        cronManager.checkUpdatePodcastCron(newLibraryItem)
      }

      numPodcastsAdded++
    }

    const taskFinishedString = {
      text: `Added ${numPodcastsAdded} podcasts`,
      key: 'MessageTaskOpmlImportFinished',
      subs: [numPodcastsAdded]
    }
    task.setFinished(taskFinishedString)
    TaskManager.taskFinished(task)
    Logger.info(`[PodcastManager] createPodcastsFromFeedUrls: Finished OPML import. Created ${numPodcastsAdded} podcasts out of ${rssFeedUrls.length} RSS feed URLs`)
  }

}
