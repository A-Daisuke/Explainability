export async function initStarter(
  starter?: string,
  root?: string
): Promise<void> {
  const { starterPath, rootPath, selectedOtherStarter } = await getPaths(
    starter,
    root
  )

  const urlObject = url.parse(rootPath)

  if (selectedOtherStarter) {
    report.info(
      `Opening the starter library at https://gatsby.dev/starters?v=2...\nThe starter library has a variety of options for starters you can browse\n\nYou can then use the gatsby new command with the link to a repository of a starter you'd like to use, for example:\ngatsby new ${rootPath} https://github.com/gatsbyjs/gatsby-starter-default`
    )
    opn(`https://gatsby.dev/starters?v=2`)
    return
  }
  if (urlObject.protocol && urlObject.host) {
    const isStarterAUrl =
      starter && !url.parse(starter).hostname && !url.parse(starter).protocol

    if (/gatsby-starter/gi.test(rootPath) && isStarterAUrl) {
      report.panic({
        id: `11610`,
        context: {
          starter,
          rootPath,
        },
      })
      return
    }
    report.panic({
      id: `11611`,
      context: {
        rootPath,
      },
    })
    return
  }

  if (!isValid(rootPath)) {
    report.panic({
      id: `11612`,
      context: {
        path: sysPath.resolve(rootPath),
      },
    })
    return
  }

  if (existsSync(sysPath.join(rootPath, `package.json`))) {
    report.panic({
      id: `11613`,
      context: {
        rootPath,
      },
    })
    return
  }

  const hostedInfo = hostedGitInfo.fromUrl(starterPath)

  if (hostedInfo) {
    await clone(hostedInfo, rootPath)
  } else {
    await copy(starterPath, rootPath)
  }

  const sitePath = sysPath.resolve(rootPath)

  const sitePackageJson = await fs
    .readJSON(sysPath.join(sitePath, `package.json`))
    .catch(() => {
      reporter.verbose(
        `Could not read "${sysPath.join(sitePath, `package.json`)}"`
      )
    })

  await updateInternalSiteMetadata(
    {
      name: sitePackageJson?.name || rootPath,
      sitePath,
      lastRun: Date.now(),
    },
    false
  )

  successMessage(rootPath)
}
