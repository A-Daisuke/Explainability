function __method_wrapper__() {
exports.publishPackagesLocallyAndInstall = async ({
  packagesToPublish,
  localPackages,
  packageNameToPath,
  ignorePackageJSONChanges,
  yarnWorkspaceRoot,
  externalRegistry,
  root,
  packageManager,
}) => {
  await startServer()

  const versionPostFix = Date.now()

  const newlyPublishedPackageVersions = {}

  for (const packageName of packagesToPublish) {
    newlyPublishedPackageVersions[packageName] = await publishPackage({
      packageName,
      packagesToPublish,
      packageNameToPath,
      versionPostFix,
      ignorePackageJSONChanges,
      root,
    })
  }

  const packagesToInstall = _.intersection(packagesToPublish, localPackages)

  await installPackages({
    packagesToInstall,
    yarnWorkspaceRoot,
    newlyPublishedPackageVersions,
    externalRegistry,
    packageManager,
  })
}

}
