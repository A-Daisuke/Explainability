function __method_wrapper__() {
module.exports.migrate = async (DatabaseModels) => {
  Logger.info(`[dbMigration] Starting migration`)

  const start = Date.now()

  // Migrate to Library and LibraryFolder models
  await handleMigrateLibraries(DatabaseModels)

  // Migrate EmailSettings, NotificationSettings and ServerSettings to Setting model
  await handleMigrateSettings(DatabaseModels)

  // Migrate Series, Author, LibraryItem, Book, Podcast
  await handleMigrateAuthorsSeriesAndLibraryItems(DatabaseModels)

  // Migrate User, MediaProgress
  await handleMigrateUsers(DatabaseModels)

  // Migrate PlaybackSession, Device
  await handleMigrateSessions(DatabaseModels)

  // Migrate Collection, CollectionBook
  await handleMigrateCollections(DatabaseModels)

  // Migrate Playlist, PlaylistMediaItem
  await handleMigratePlaylists(DatabaseModels)

  // Migrate Feed, FeedEpisode
  await handleMigrateFeeds(DatabaseModels)

  // Purge author images and cover images from cache
  try {
    const CachePath = Path.join(global.MetadataPath, 'cache')
    await fs.emptyDir(Path.join(CachePath, 'covers'))
    await fs.emptyDir(Path.join(CachePath, 'images'))
  } catch (error) {
    Logger.error(`[dbMigration] Failed to purge author/cover image cache`, error)
  }

  // Put all old db folders into a zipfile oldDb.zip
  await oldDbFiles.zipWrapOldDb()

  const elapsed = Date.now() - start
  Logger.info(`[dbMigration] Migration complete. Elapsed ${(elapsed / 1000).toFixed(2)}s`)
}

}
