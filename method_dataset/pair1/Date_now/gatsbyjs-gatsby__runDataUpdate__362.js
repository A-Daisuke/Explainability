async function runDataUpdate() {
  const { env } = await createClient()

  const entries = await env.getEntries({
    content_type: 'article',
    limit: 1
  })

  let entry = entries.items[0]
  const title = entry.fields.title[locale]
  entry.fields.title[locale] = `${title.substring(0, title.lastIndexOf(` `))} ${Date.now()}`

  entry = await entry.update()
  await entry.publish()
  console.log(`Updated ${chalk.green(entry.sys.id)}`)
}
