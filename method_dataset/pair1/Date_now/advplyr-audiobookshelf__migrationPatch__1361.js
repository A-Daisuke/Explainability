function __method_wrapper__() {
module.exports.migrationPatch = async (ctx) => {
  const queryInterface = ctx.sequelize.getQueryInterface()
  const librariesTableDescription = await queryInterface.describeTable('libraries')

  if (librariesTableDescription?.extraData) {
    Logger.info(`[dbMigration] Migration patch 2.3.0+ - extraData columns already on model`)
  } else {
    const migrationResult = await migrationPatchNewColumns(queryInterface)
    if (migrationResult === false) {
      return
    }
  }

  const oldDbPath = Path.join(global.ConfigPath, 'oldDb.zip')
  if (!(await fs.pathExists(oldDbPath))) {
    Logger.info(`[dbMigration] Migration patch 2.3.0+ unnecessary - no oldDb.zip found`)
    return
  }

  const migrationStart = Date.now()
  Logger.info(`[dbMigration] Applying migration patch from 2.3.0+`)

  // Extract from oldDb.zip
  if (!(await oldDbFiles.checkExtractItemsUsersAndLibraries())) {
    return
  }

  await handleOldLibraryItems(ctx)
  await handleOldLibraries(ctx)
  await handleOldUsers(ctx)

  await oldDbFiles.removeOldItemsUsersAndLibrariesFolders()

  const elapsed = Date.now() - migrationStart
  Logger.info(`[dbMigration] Migration patch 2.3.0+ finished. Elapsed ${(elapsed / 1000).toFixed(2)}s`)
}

}
