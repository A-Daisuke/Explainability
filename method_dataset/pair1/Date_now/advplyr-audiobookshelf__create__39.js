class __C__ {
  async create(req, res) {
    if (!req.user.isAdminOrUp) {
      Logger.error(`[PodcastController] Non-admin user "${req.user.username}" attempted to create podcast`)
      return res.sendStatus(403)
    }
    const payload = req.body
    if (!payload.media || !payload.media.metadata) {
      return res.status(400).send('Invalid request body. "media" and "media.metadata" are required')
    }

    const library = await Database.libraryModel.findByIdWithFolders(payload.libraryId)
    if (!library) {
      Logger.error(`[PodcastController] Create: Library not found "${payload.libraryId}"`)
      return res.status(404).send('Library not found')
    }

    const folder = library.libraryFolders.find((fold) => fold.id === payload.folderId)
    if (!folder) {
      Logger.error(`[PodcastController] Create: Folder not found "${payload.folderId}"`)
      return res.status(404).send('Folder not found')
    }

    const podcastPath = filePathToPOSIX(payload.path)

    // Check if a library item with this podcast folder exists already
    const existingLibraryItem =
      (await Database.libraryItemModel.count({
        where: {
          path: podcastPath
        }
      })) > 0
    if (existingLibraryItem) {
      Logger.error(`[PodcastController] Podcast already exists at path "${podcastPath}"`)
      return res.status(400).send('Podcast already exists')
    }

    const success = await fs
      .ensureDir(podcastPath)
      .then(() => true)
      .catch((error) => {
        Logger.error(`[PodcastController] Failed to ensure podcast dir "${podcastPath}"`, error)
        return false
      })
    if (!success) return res.status(400).send('Invalid podcast path')

    const libraryItemFolderStats = await getFileTimestampsWithIno(podcastPath)

    let relPath = payload.path.replace(folder.fullPath, '')
    if (relPath.startsWith('/')) relPath = relPath.slice(1)

    let newLibraryItem = null
    const transaction = await Database.sequelize.transaction()
    try {
      const podcast = await Database.podcastModel.createFromRequest(payload.media, transaction)

      newLibraryItem = await Database.libraryItemModel.create(
        {
          ino: libraryItemFolderStats.ino,
          path: podcastPath,
          relPath,
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
          libraryId: library.id,
          libraryFolderId: folder.id,
          title: podcast.title,
          titleIgnorePrefix: podcast.titleIgnorePrefix
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      Logger.error(`[PodcastController] Failed to create podcast: ${error}`)
      await transaction.rollback()
      return res.status(500).send('Failed to create podcast')
    }

    newLibraryItem.media = await newLibraryItem.getMediaExpanded()

    // Download and save cover image
    if (typeof payload.media.metadata.imageUrl === 'string' && payload.media.metadata.imageUrl.startsWith('http')) {
      // Podcast cover will always go into library item folder
      const coverResponse = await CoverManager.downloadCoverFromUrlNew(payload.media.metadata.imageUrl, newLibraryItem.id, newLibraryItem.path, true)
      if (coverResponse.error) {
        Logger.error(`[PodcastController] Download cover error from "${payload.media.metadata.imageUrl}": ${coverResponse.error}`)
      } else if (coverResponse.cover) {
        const coverImageFileStats = await getFileTimestampsWithIno(coverResponse.cover)
        if (!coverImageFileStats) {
          Logger.error(`[PodcastController] Failed to get cover image stats for "${coverResponse.cover}"`)
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

    res.json(newLibraryItem.toOldJSONExpanded())

    // Turn on podcast auto download cron if not already on
    if (newLibraryItem.media.autoDownloadEpisodes) {
      this.cronManager.checkUpdatePodcastCron(newLibraryItem)
    }
  }

}
