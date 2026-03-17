        const getNext = async (
          url,
          currentLanguage,
          filterByLanguages,
          renamedEnabledLanguages
        ) => {
          if (typeof url === `object`) {
            // url can be string or object containing href field
            url = url.href

            // Apply any filters configured in gatsby-config.js. Filters
            // can be any valid JSON API filter query string.
            // See https://www.drupal.org/docs/8/modules/jsonapi/filtering
            if (typeof filters === `object`) {
              if (filters.hasOwnProperty(type)) {
                url = new URL(url)
                const filterParams = new URLSearchParams(filters[type])
                const filterKeys = Array.from(filterParams.keys())
                filterKeys.forEach(filterKey => {
                  // Only add filter params to url if it has not already been
                  // added.
                  if (!url.searchParams.has(filterKey)) {
                    url.searchParams.set(filterKey, filterParams.get(filterKey))
                  }
                })
                url = url.toString()
              }
            }
          }

          // If proxyUrl is defined, use it instead of baseUrl to get the content.
          if (proxyUrl !== baseUrl) {
            url = url.replace(baseUrl, proxyUrl)
          }

          let d
          try {
            d = await requestQueue.push([
              url,
              {
                username: basicAuth.username,
                password: basicAuth.password,
                headers,
                searchParams: params,
                responseType: `json`,
                parentSpan: fullFetchSpan,
                timeout: {
                  // Occasionally requests to Drupal stall. Set a (default) 30s timeout to retry in this case.
                  request: requestTimeoutMS,
                },
              },
            ])
          } catch (error) {
            if (error.response && error.response.statusCode == 405) {
              // The endpoint doesn't support the GET method, so just skip it.
              return
            } else {
              console.error(`Failed to fetch ${url}`, error.message)
              console.log(error)
              throw error
            }
          }

          if (d.body.data && currentLanguage && filterByLanguages) {
            const languageCodeForFilter =
              renamedEnabledLanguages &&
              renamedEnabledLanguages.find(
                language => language.as === currentLanguage
              )
                ? renamedEnabledLanguages.find(
                    language => language.as === currentLanguage
                  ).langCode
                : currentLanguage

            d.body.data = d.body.data.filter(
              n => n.attributes.langcode === languageCodeForFilter
            )
          }

          if (d.body.data) {
            // @ts-ignore
            dataArray.push(...(d.body.data || []))
          }

          // Add support for includes. Includes allow entity data to be expanded
          // based on relationships. The expanded data is exposed as `included`
          // in the JSON API response.
          // See https://www.drupal.org/docs/8/modules/jsonapi/includes
          if (d.body.included) {
            // @ts-ignore
            dataArray.push(...(d.body.included || []))
          }

          // If JSON:API extras is configured to add the resource count, we can queue
          // all API requests immediately instead of waiting for each request to return
          // the next URL. This lets us request resources in parallel vs. sequentially
          // which is much faster.
          if (d.body.meta?.count) {
            const typeLangKey = type + currentLanguage
            // If we hadn't added urls yet
            if (
              d.body.links.next?.href &&
              !typeRequestsQueued.has(typeLangKey)
            ) {
              typeRequestsQueued.add(typeLangKey)

              // Get count of API requests
              // We round down as we've already gotten the first page at this point.
              const pageSize = Number(
                new URL(d.body.links.next.href).searchParams.get(`page[limit]`)
              )
              const requestsCount = Math.floor(d.body.meta.count / pageSize)

              reporter.verbose(
                `queueing ${requestsCount} API requests for type ${type} which has ${d.body.meta.count} entities.`
              )

              const newUrl = new URL(d.body.links.next.href)
              await Promise.all(
                _.range(requestsCount).map((pageOffset: number) => {
                  // We're starting 1 ahead.
                  pageOffset += 1
                  // Construct URL with new pageOffset.
                  newUrl.searchParams.set(
                    `page[offset]`,
                    String(pageOffset * pageSize)
                  )
                  return getNext(
                    newUrl.toString(),
                    currentLanguage,
                    filterByLanguages,
                    renamedEnabledLanguages
                  )
                })
              )
            }
          } else if (d.body.links?.next) {
            await getNext(
              d.body.links.next,
              currentLanguage,
              filterByLanguages,
              renamedEnabledLanguages
            )
          }
        }
